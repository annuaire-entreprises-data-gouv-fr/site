import { HttpServerError } from "#/clients/exceptions";
import { isAPINotResponding } from "#/models/api-not-responding";
import {
  CanRequestAuthorizationException,
  OrganisationNotAnAdministration,
} from "#/models/authentication/authentication-exceptions";
import type { IUniteLegale } from "#/models/core/types";
import { fetchUniteLegaleFromRechercheEntreprise } from "#/models/core/unite-legale";
import { extractSirenFromSiret, type Siren, type Siret } from "#/utils/helpers";
import { defaultAgentScopes, type IAgentScope } from "../scopes/constants";
import { mightBeAnAuthorizedAdministration } from "./might-be-an-administration";

const organisationHabilitation = {
  scopes: [...defaultAgentScopes],
  groupsScopes: {} as Record<Siret, IAgentScope[]>,
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
        uniteLegale.siren,
        uniteLegale.nomComplet
      );
    }
    throw new OrganisationNotAnAdministration(
      uniteLegale.siren,
      uniteLegale.nomComplet
    );
  }

  isAnAuthorizedAdministration(uniteLegale: IUniteLegale) {
    return uniteLegale.aAccesEspaceAgent;
  }
}
