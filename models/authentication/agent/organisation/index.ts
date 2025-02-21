import { HttpForbiddenError } from '#clients/exceptions';
import {
  CanRequestAuthorizationException,
  NeedASiretException,
} from '#models/authentication/authentication-exceptions';
import { isServicePublic } from '#models/core/types';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import { extractSirenFromSiret, Siren } from '#utils/helpers';
import { defaultAgentScopes } from '../scopes';
import {
  isAdministrationButNotL100_3,
  mightBeAnAdministration,
} from './might-be-an-administration';

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
    const uniteLegale = await getUniteLegaleFromSlug(this.siren, {
      page: 0,
      isBot: false,
    });

    const isAnAdministration = isServicePublic(uniteLegale);
    const codeJuridique = (uniteLegale.natureJuridique || '').replace('.', '');

    if (isAnAdministration) {
      if (isAdministrationButNotL100_3(codeJuridique)) {
        throw new CanRequestAuthorizationException(
          uniteLegale.natureJuridique,
          this.siren
        );
      } else if (this.isAdministrationTrustworthy()) {
        return basicOrganisationHabilitation;
      }
      return basicOrganisationHabilitation;
    }

    if (mightBeAnAdministration(codeJuridique)) {
      throw new CanRequestAuthorizationException(
        uniteLegale.natureJuridique,
        this.siren
      );
    }

    throw new HttpForbiddenError('Organization is not a service public');
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
