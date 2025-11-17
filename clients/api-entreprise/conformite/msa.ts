import routes from "#clients/routes";
import type { IAgentScope } from "#models/authentication/agent/scopes/constants";
import type { IConformiteMSA } from "#models/espace-agent/conformite";
import type { UseCase } from "#models/use-cases";
import type { Siret } from "#utils/helpers";
import clientAPIEntreprise, { type IAPIEntrepriseResponse } from "../client";

export type IAPIEntrepriseConformiteMSA = IAPIEntrepriseResponse<{
  status: "up_to_date" | "outdated" | "under_investigation";
}>;

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseConformiteMSA = async (
  siret: Siret,
  scope: IAgentScope | null,
  useCase?: UseCase
) =>
  await clientAPIEntreprise<IAPIEntrepriseConformiteMSA, IConformiteMSA>(
    routes.apiEntreprise.conformite.msa(siret),
    mapToDomainObject,
    { scope, useCase }
  );

const mapToDomainObject = (response: IAPIEntrepriseConformiteMSA) => {
  let status: IConformiteMSA["status"] = "non_a_jour";
  if (response.data?.status === "up_to_date") {
    status = "a_jour";
  } else if (response.data?.status === "under_investigation") {
    status = "sous_investigation";
  }

  return {
    status,
    url: null,
    label: null,
  };
};
