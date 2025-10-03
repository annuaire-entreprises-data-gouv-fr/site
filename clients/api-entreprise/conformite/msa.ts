import routes from "#clients/routes";
import type { IConformite } from "#models/espace-agent/conformite";
import type { UseCase } from "#models/use-cases";
import type { Siret } from "#utils/helpers";
import clientAPIEntreprise, { type IAPIEntrepriseResponse } from "../client";

export type IAPIEntrepriseConformiteMSA = IAPIEntrepriseResponse<{
  status: "up_to_date" | string;
}>;

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseConformiteMSA = async (
  siret: Siret,
  useCase?: UseCase
) =>
  await clientAPIEntreprise<IAPIEntrepriseConformiteMSA, IConformite>(
    routes.apiEntreprise.conformite.msa(siret),
    mapToDomainObject,
    { useCase }
  );

const mapToDomainObject = (response: IAPIEntrepriseConformiteMSA) => ({
  isValid: response.data?.status === "up_to_date",
  url: null,
  label: null,
});
