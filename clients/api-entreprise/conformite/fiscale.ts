import routes from "#clients/routes";
import type { IConformite } from "#models/espace-agent/conformite";
import type { UseCase } from "#models/use-cases";
import type { Siren } from "#utils/helpers";
import clientAPIEntreprise, { type IAPIEntrepriseResponse } from "../client";

export type IAPIEntrepriseConformiteFiscale = IAPIEntrepriseResponse<{
  document_url: string;
  document_url_expires_in: number;
  date_delivrance_attestation: string;
  date_periode_analysee: string;
}>;

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseConformiteFiscale = async (
  siren: Siren,
  useCase?: UseCase
) =>
  await clientAPIEntreprise<IAPIEntrepriseConformiteFiscale, IConformite>(
    routes.apiEntreprise.conformite.fiscale(siren),
    mapToDomainObject,
    {
      useCase,
    }
  );

const mapToDomainObject = (response: IAPIEntrepriseConformiteFiscale) => ({
  url: response.data.document_url,
  isValid: true,
  label: "Attestation fiscale",
});
