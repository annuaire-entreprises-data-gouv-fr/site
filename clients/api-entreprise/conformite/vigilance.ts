import routes from "#clients/routes";
import type { IAgentScope } from "#models/authentication/agent/scopes/constants";
import type { IConformiteVigilance } from "#models/espace-agent/conformite";
import type { UseCase } from "#models/use-cases";
import type { Siren } from "#utils/helpers";
import clientAPIEntreprise, { type IAPIEntrepriseResponse } from "../client";

export type IAPIEntrepriseConformiteVigilance = IAPIEntrepriseResponse<{
  entity_status: {
    code: "ok" | "refus_de_delivrance";
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
  scope: IAgentScope | null,
  useCase?: UseCase
) =>
  await clientAPIEntreprise<
    IAPIEntrepriseConformiteVigilance,
    IConformiteVigilance
  >(routes.apiEntreprise.conformite.vigilance(siren), mapToDomainObject, {
    scope,
    useCase,
  });

const mapToDomainObject = (response: IAPIEntrepriseConformiteVigilance) =>
  ({
    url: response.data.document_url,
    status:
      response.data?.entity_status?.code === "ok" ? "a_jour" : "non_a_jour",
    dateDelivrance: response.data.date_debut_validite,
    dateFinValidite: response.data.date_fin_validite,
    label: "Attestation de vigilance",
  }) as const;
