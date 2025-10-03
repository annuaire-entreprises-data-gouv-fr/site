import { HttpForbiddenError, HttpServerError } from "#clients/exceptions";
import { isAPINotResponding } from "#models/api-not-responding";
import { CanRequestAuthorizationException } from "#models/authentication/authentication-exceptions";
import type { IUniteLegale } from "#models/core/types";
import { fetchUniteLegaleFromRechercheEntreprise } from "#models/core/unite-legale";
import { extractSirenFromSiret, type Siren, type Siret } from "#utils/helpers";
import { defaultAgentScopes } from "../scopes/constants";
import { mightBeAnAuthorizedAdministration } from "./might-be-an-administration";
import { isOrganisationWhitelisted } from "./whitelisted-administrations";

const organisationHabilitation = {
  scopes: [...defaultAgentScopes],
  userType: "Agent connecté",
  isSuperAgent: false,
};

export class AgentOrganisation {
  private isFromMCP: boolean;
  private siren: Siren;

  constructor(idpId: string, siret: Siret) {
    this.isFromMCP = this.isMCP(idpId);
    this.siren = extractSirenFromSiret(siret);
  }

  async getHabilitationLevel() {
    const uniteLegale = await fetchUniteLegaleFromRechercheEntreprise(
      this.siren,
      0,
      true
    );

    if (isAPINotResponding(uniteLegale)) {
      throw new HttpServerError("Failed to fetch organisation details");
    }

    const codeJuridique = (uniteLegale.natureJuridique || "").replace(".", "");
    const isAuthorized = this.isAnAuthorizedAdministration(
      uniteLegale,
      codeJuridique
    );

    if (isAuthorized) {
      return organisationHabilitation;
    } else {
      if (mightBeAnAuthorizedAdministration(codeJuridique)) {
        throw new CanRequestAuthorizationException(
          uniteLegale.natureJuridique,
          this.siren
        );
      }
      throw new HttpForbiddenError("Organization is not a service public");
    }
  }

  isAnAuthorizedAdministration(
    uniteLegale: IUniteLegale,
    codeJuridique: string
  ) {
    if (isOrganisationWhitelisted(this.siren)) {
      return true;
    }
    if (uniteLegale.complements.estL100_3) {
      return true;
    }
    return false;
  }

  isMCP(idp_id: string) {
    if (idp_id === "71144ab3-ee1a-4401-b7b3-79b44f7daeeb") {
      return true;
    } else {
      return false;
    }
  }
}
