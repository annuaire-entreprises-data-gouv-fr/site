import { HttpServerError } from "#clients/exceptions";
import { isAPINotResponding } from "#models/api-not-responding";
import {
  CanRequestAuthorizationException,
  OrganisationNotAnAdministration,
} from "#models/authentication/authentication-exceptions";
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
  private siren: Siren;

  constructor(siret: Siret) {
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
    const isAuthorized = this.isAnAuthorizedAdministration(uniteLegale);

    if (isAuthorized) {
      return organisationHabilitation;
    }
    if (mightBeAnAuthorizedAdministration(codeJuridique)) {
      throw new CanRequestAuthorizationException(
        uniteLegale.natureJuridique,
        this.siren
      );
    }
    throw new OrganisationNotAnAdministration(
      uniteLegale.siren,
      uniteLegale.nomComplet
    );
  }

  isAnAuthorizedAdministration(uniteLegale: IUniteLegale) {
    if (isOrganisationWhitelisted(this.siren)) {
      return true;
    }
    if (uniteLegale.complements.estL100_3) {
      return true;
    }
    return false;
  }
}
