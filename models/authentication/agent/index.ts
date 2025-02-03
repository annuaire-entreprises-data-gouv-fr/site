import { IProConnectUserInfo } from '#clients/authentication/pro-connect/strategy';
import { superAgentsList } from '#clients/authentication/super-agent-list/agent-list';
import { HttpForbiddenError } from '#clients/exceptions';
import { isServicePublic } from '#models/core/types';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import { extractSirenFromSiret } from '#utils/helpers';
import {
  CanRequestAuthorizationException,
  NoSiretException,
} from '../authentication-exceptions';
import { mapIdpToSiret } from './orgas/idpid-to-siret';
import { mightBeAuthorized } from './orgas/might-be-authorized';
import { isOrganisationWhitelisted } from './orgas/whitelist';
import { defaultAgentScopes } from './scopes/default-agent-scopes';
import { IAgentScope } from './scopes/parse';
import { extractDomain, isFromMCP, isLikelyPrestataire } from './utils';

export type IAgentInfo = {
  userId: string;
  idpId: string;
  domain: string;
  email: string;
  familyName: string;
  firstName: string;
  fullName: string;
  siret: string;
  scopes: IAgentScope[];
  userType: string;
  isPrestataire: boolean;
};

export class AgentConnected {
  private domain;
  private isPrestataire;
  private idpId;
  private email;
  private familyName;
  private firstName;
  private userId;
  private siret;

  constructor(userInfo: IProConnectUserInfo) {
    this.domain = extractDomain(userInfo?.email || '');
    this.isPrestataire = isLikelyPrestataire(this.domain);

    this.idpId = userInfo.idp_id ?? '';
    this.email = userInfo.email ?? '';
    this.familyName = userInfo.family_name ?? '';
    this.firstName = userInfo.given_name ?? '';
    this.userId = userInfo.sub;
    this.siret = mapIdpToSiret(userInfo.siret, this.idpId);
  }

  /**
   * Habilitation is either agent-level or organisation-level
   * @returns
   */
  async getHabilitationLevel() {
    const agentHabilitation = await this.getAgentHabilitation();
    if (agentHabilitation) {
      return agentHabilitation;
    }
    return this.getOrganisationHabilitation();
  }

  async getAgentHabilitation() {
    const superAgentScopes = await superAgentsList.getScopeForAgent(this.email);

    if (superAgentScopes.length > 0) {
      return {
        scopes: [...defaultAgentScopes, ...superAgentScopes],
        userType: 'Super-agent connecté',
        isSuperAgent: true,
      };
    }
    return null;
  }

  async getOrganisationHabilitation() {
    const organisationHabilitation = {
      scopes: [...defaultAgentScopes],
      userType: 'Agent connecté',
      isSuperAgent: false,
    };

    if (!this.siret) {
      throw new NoSiretException(
        'The user doesn‘t have a siret',
        `${this.domain} - ${this.idpId} - ${
          isFromMCP(this.idpId) ? 'ProConnectIdentité' : 'FI ministères'
        }`
      );
    }

    const siren = extractSirenFromSiret(this.siret);

    if (isOrganisationWhitelisted(siren)) {
      return organisationHabilitation;
    }

    const uniteLegale = await getUniteLegaleFromSlug(siren, {
      page: 0,
      isBot: false,
    });

    if (isServicePublic(uniteLegale)) {
      return organisationHabilitation;
    }

    if (mightBeAuthorized(uniteLegale.natureJuridique)) {
      throw new CanRequestAuthorizationException(
        uniteLegale.natureJuridique,
        siren
      );
    }

    throw new HttpForbiddenError('Organization is not a service public');
  }

  /**
   * Verify agent rights and extract all required agent informations
   * @returns
   */
  async getAndVerifyAgentInfo() {
    const habilitationLevel = await this.getHabilitationLevel();
    return {
      userId: this.userId,
      idpId: this.idpId,
      domain: this.domain,
      email: this.email,
      familyName: this.familyName,
      firstName: this.firstName,
      fullName: this.familyName ? `${this.firstName} ${this.familyName}` : '',
      siret: this.siret,
      isPrestataire: this.isPrestataire,
      ...habilitationLevel,
    };
  }
}
