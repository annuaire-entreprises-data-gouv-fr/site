import routes from "#clients/routes";
import type { IConformite } from "#models/espace-agent/conformite";
import type { UseCase } from "#models/use-cases";
import type { Siren } from "#utils/helpers";
import clientAPIEntreprise, { type IAPIEntrepriseResponse } from "../client";

export type IAPIEntrepriseConformiteVigilance = IAPIEntrepriseResponse<{
  entity_status: {
    code: "ok";
    libelle: string;
    description: string;
  };
  date_debut_validite: string;
  date_fin_validite: string;
  code_securite: string;
  document_url: string;
  document_url_expires_in: number;
}>;
/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseConformiteVigilance = async (
  siren: Siren,
  useCase?: UseCase
) =>
  await clientAPIEntreprise<IAPIEntrepriseConformiteVigilance, IConformite>(
    routes.apiEntreprise.conformite.vigilance(siren),
    mapToDomainObject,
    {
      useCase,
    }
  );

const mapToDomainObject = (response: IAPIEntrepriseConformiteVigilance) => ({
  url: response.data.document_url,
  isValid: response.data?.entity_status?.code === "ok",
  label: "Attestation de vigilance",
});
