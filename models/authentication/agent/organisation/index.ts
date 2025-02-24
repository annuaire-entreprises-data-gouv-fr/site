import { HttpForbiddenError, HttpServerError } from '#clients/exceptions';
import { isAPINotResponding } from '#models/api-not-responding';
import {
  CanRequestAuthorizationException,
  NeedASiretException,
} from '#models/authentication/authentication-exceptions';
import { isServicePublic, IUniteLegale } from '#models/core/types';
import { fetchUniteLegaleFromRechercheEntreprise } from '#models/core/unite-legale';
import { extractSirenFromSiret, Siren } from '#utils/helpers';
import { defaultAgentScopes } from '../scopes';
import {
  isAdministrationButNotL100_3,
  mightBeAnAuthorizedAdministration,
} from './might-be-an-administration';
import { isOrganisationWhitelisted } from './whitelisted-administrations';

const basicOrganisationHabilitation = {
  scopes: [...defaultAgentScopes],
  userType: 'Agent connecté',
  isSuperAgent: false,
};

const thrustworthyOrganisationHabilitation = {
  scopes: [...defaultAgentScopes],
  userType: 'Agent connecté',
  isSuperAgent: false,
};

export class AgentOrganisation {
  private isFromMCP: boolean;
  private siren: Siren;

  constructor(private domain: string, private idpId: string, siret: string) {
    this.isFromMCP = this.isMCP(idpId);

    if (!siret) {
      throw new NeedASiretException(
        'The user doesn‘t have a siret',
        `${this.domain} - ${this.idpId} - ${
          this.isFromMCP ? 'ProConnectIdentité' : 'FI ministères'
        }`
      );
    }

    this.siren = extractSirenFromSiret(siret);
  }

  async getHabilitationLevel() {
    const uniteLegale = await fetchUniteLegaleFromRechercheEntreprise(
      this.siren,
      0,
      true
    );

    if (isAPINotResponding(uniteLegale)) {
      throw new HttpServerError('Failed to fetch organisation details');
    }

    const codeJuridique = (uniteLegale.natureJuridique || '').replace('.', '');
    const isAuthorized = this.isAnAuthorizedAdministration(
      uniteLegale,
      codeJuridique
    );

    if (isAuthorized) {
      if (this.isAdministrationTrustworthy()) {
        return thrustworthyOrganisationHabilitation;
      } else {
        return basicOrganisationHabilitation;
      }
    } else {
      if (mightBeAnAuthorizedAdministration(codeJuridique)) {
        throw new CanRequestAuthorizationException(
          uniteLegale.natureJuridique,
          this.siren
        );
      }
      throw new HttpForbiddenError('Organization is not a service public');
    }
  }

  isAnAuthorizedAdministration(
    uniteLegale: IUniteLegale,
    codeJuridique: string
  ) {
    if (isOrganisationWhitelisted(this.siren)) {
      return true;
    }
    if (isServicePublic(uniteLegale)) {
      if (isAdministrationButNotL100_3(codeJuridique)) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  isAdministrationTrustworthy() {
    return !this.isMCP;
  }

  isMCP(idp_id: string) {
    if (idp_id === '71144ab3-ee1a-4401-b7b3-79b44f7daeeb') {
      return true;
    } else {
      return false;
    }
  }
}
