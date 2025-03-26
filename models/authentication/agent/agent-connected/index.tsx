import { IProConnectUserInfo } from '#clients/authentication/pro-connect/strategy';
import { superAgentsList } from '#clients/authentication/super-agents';
import {
  NeedASiretException,
  PrestataireException,
} from '#models/authentication/authentication-exceptions';
import { isSiret, verifySiret } from '#utils/helpers';
import { AgentOrganisation } from '../organisation';
import { defaultAgentScopes } from '../scopes';

export class AgentConnected {
  private domain;
  private idpId;
  private email;
  private familyName;
  private firstName;
  private userId;
  private siret;

  constructor(userInfo: IProConnectUserInfo) {
    this.domain = this.extractDomain(userInfo?.email || '');
    this.idpId = userInfo.idp_id ?? '';
    this.email = userInfo.email ?? '';
    this.familyName = userInfo.family_name ?? '';
    this.firstName = userInfo.given_name ?? '';
    this.userId = userInfo.sub;

    const siretAsString = (userInfo.siret || '').replaceAll(' ', '');

    if (!siretAsString || !isSiret(siretAsString)) {
      throw new NeedASiretException(
        'The user doesn‘t have a siret',
        `${this.domain} - ${this.idpId}`
      );
    }

    this.siret = verifySiret(siretAsString);
  }

  extractDomain(email: string) {
    try {
      return (email.match(/@(.*)/) || ['']).shift() || '';
    } catch {
      return '';
    }
  }

  isLikelyPrestataire = () => {
    for (let bannedDomain of [
      'beta.gouv.fr',
      'code.gouv.fr',
      'data.gouv.fr',
      'demarches-simplifiees.fr',
      'entreprise.api.gouv.fr',
      'franceconnect.gouv.fr',
      'monstagedetroisieme.fr',
      'scn.rie.gouv.fr',
    ]) {
      if (this.domain.indexOf(bannedDomain) > -1) {
        return true;
      }
    }

    if (
      !!this.email.match(
        /[.@-]*(ext|external|externe|presta|prestataire)(s)*[.@-]/g
      )
    ) {
      return true;
    }

    return false;
  };

  /**
   * Habilitation is either agent-level or organisation-level
   * @returns
   */
  async getHabilitationLevel() {
    const agentHabilitation = await this.getAgentHabilitation();
    if (agentHabilitation) {
      return agentHabilitation;
    }

    // exclude prestataire from getting habilitation
    if (this.isLikelyPrestataire()) {
      throw new PrestataireException(`${this.email} is a prestataire`);
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
    const organisation = new AgentOrganisation(this.idpId, this.siret);
    return await organisation.getHabilitationLevel();
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
      ...habilitationLevel,
    };
  }
}
