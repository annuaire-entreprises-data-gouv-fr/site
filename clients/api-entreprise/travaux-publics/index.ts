import routes from "#clients/routes";
import type { IAgentScope } from "#models/authentication/agent/scopes/constants";
import type { IDocumentDownloader } from "#models/espace-agent/travaux-publics";
import type { UseCase } from "#models/use-cases";
import type { Siren, Siret } from "#utils/helpers";
import clientAPIEntreprise, { type IAPIEntrepriseResponse } from "../client";

export type IAPIEntrepriseDocumentTravauxPublics = IAPIEntrepriseResponse<{
  document_url: string;
  expires_in: number;
}>;

/**
 * GET document CIBTP
 */
export const clientApiEntrepriseCibtp = async (
  siret: Siret,
  scope: IAgentScope | null,
  useCase?: UseCase
) =>
  await clientAPIEntreprise(
    routes.apiEntreprise.certifications.cibtp(siret),
    mapToDomainObject,
    { scope, useCase }
  );

/**
 * GET document Pro BTP
 */
export const clientApiEntrepriseProbtp = async (
  siret: Siret,
  scope: IAgentScope | null,
  useCase?: UseCase
) =>
  await clientAPIEntreprise(
    routes.apiEntreprise.certifications.probtp(siret),
    mapToDomainObject,
    { scope, useCase }
  );

/**
 * GET document CNETP
 */
export const clientApiEntrepriseCnetp = async (
  siren: Siren,
  scope: IAgentScope | null,
  useCase?: UseCase
) =>
  await clientAPIEntreprise(
    routes.apiEntreprise.certifications.cnetp(siren),
    mapToDomainObject,
    { scope, useCase }
  );

/**
 * GET document FNTP
 */
export const clientApiEntrepriseCarteProfessionnelleTravauxPublics = async (
  siren: Siren,
  scope: IAgentScope | null,
  useCase?: UseCase
) =>
  await clientAPIEntreprise(
    routes.apiEntreprise.carteProfessionnelleTravauxPublics(siren),
    mapToDomainObject,
    { scope, useCase }
  );

const mapToDomainObject = (
  response: IAPIEntrepriseDocumentTravauxPublics
): IDocumentDownloader => ({
  url: response.data.document_url,
});
