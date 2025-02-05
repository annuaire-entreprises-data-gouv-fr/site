import { HttpForbiddenError } from '#clients/exceptions';
import {
  CanRequestAuthorizationException,
  NoSiretException,
} from '#models/authentication/authentication-exceptions';
import { isServicePublic } from '#models/core/types';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import { extractSirenFromSiret, Siren } from '#utils/helpers';
import { defaultAgentScopes } from '../scopes/default-agent-scopes';
import { mightBeAuthorized } from './might-be-authorized';
import { isOrganisationWhitelisted } from './whitelist';

const basicOrganisationHabilitation = {
  scopes: [...defaultAgentScopes],
  userType: 'Agent connecté',
  isSuperAgent: false,
};

export class AgentOrganisation {
  private isFromMCP: boolean;
  private isDINUM: boolean;
  private siren: Siren;

  constructor(private domain: string, private idpId: string, siret: string) {
    this.isFromMCP = this.isMCP(idpId);
    this.siren = extractSirenFromSiret(siret);
    this.isDINUM = siret === '130025265';
  }

  isTrustworthy() {
    return !this.isMCP && !this.isDINUM;
  }

  isMCP(idp_id: string) {
    if (idp_id === '71144ab3-ee1a-4401-b7b3-79b44f7daeeb') {
      return true;
    } else {
      return false;
    }
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

    if (isOrganisationWhitelisted(this.siren)) {
      return basicOrganisationHabilitation;
    }

    const uniteLegale = await getUniteLegaleFromSlug(this.siren, {
      page: 0,
      isBot: false,
    });

    if (isServicePublic(uniteLegale)) {
      // const isTrustworthyOrganisation = !(isMCP || siren= DINUM)
      // if(isTrustworthyOrganisation) {
      //   return trustworthytOrganisationHabilitation;
      // }
      return basicOrganisationHabilitation;
    }

    if (mightBeAuthorized(uniteLegale.natureJuridique)) {
      throw new CanRequestAuthorizationException(
        uniteLegale.natureJuridique,
        this.siren
      );
    }

    throw new HttpForbiddenError('Organization is not a service public');
  }
}
