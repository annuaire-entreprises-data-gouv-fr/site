import { HttpForbiddenError } from '#clients/exceptions';
import {
  CanRequestAuthorizationException,
  NoSiretException,
} from '#models/authentication/authentication-exceptions';
import { isServicePublic, IUniteLegale } from '#models/core/types';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import { extractSirenFromSiret, Siren } from '#utils/helpers';
import { defaultAgentScopes } from '../scopes/default-agent-scopes';
import { mightBeAnAdministration } from './might-be-an-administration';

const basicOrganisationHabilitation = {
  scopes: [...defaultAgentScopes],
  userType: 'Agent connecté',
  isSuperAgent: false,
};

export class AgentOrganisation {
  private isFromMCP: boolean;
  private siren: Siren;

  constructor(private domain: string, private idpId: string, siret: string) {
    this.isFromMCP = this.isMCP(idpId);
    this.siren = extractSirenFromSiret(siret);
  }

  async getHabilitationLevel() {
    if (!this.siren) {
      throw new NoSiretException(
        'The user doesn‘t have a siret',
        `${this.domain} - ${this.idpId} - ${
          this.isFromMCP ? 'ProConnectIdentité' : 'FI ministères'
        }`
      );
    }

    const uniteLegale = await getUniteLegaleFromSlug(this.siren, {
      page: 0,
      isBot: false,
    });

    const isAnAdministration = isServicePublic(uniteLegale);
    if (isAnAdministration) {
      if (!this.isAdministrationAuthorized(uniteLegale)) {
        throw new CanRequestAuthorizationException(
          uniteLegale.natureJuridique,
          this.siren
        );
      } else if (this.isAdministrationTrustworthy()) {
        // return trustworthytOrganisationHabilitation;
        return basicOrganisationHabilitation;
      }
      return basicOrganisationHabilitation;
    }

    if (mightBeAnAdministration(uniteLegale.natureJuridique)) {
      throw new CanRequestAuthorizationException(
        uniteLegale.natureJuridique,
        this.siren
      );
    }

    throw new HttpForbiddenError('Organization is not a service public');
  }

  isAdministrationAuthorized(uniteLegale: IUniteLegale) {
    const rawCode = (uniteLegale.natureJuridique || '').replace('.', '');
    if (
      ['4110', '4120', '4140', '4150', '7381', '7410'].indexOf(rawCode) > -1
    ) {
      // not a L103 admnistration therefore not authorized
      return false;
    }
    return true;
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
