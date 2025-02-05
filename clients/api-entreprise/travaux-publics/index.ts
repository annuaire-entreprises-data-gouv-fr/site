import routes from '#clients/routes';
import { IDocumentDownloader } from '#models/espace-agent/travaux-publics';
import { UseCase } from '#models/use-cases';
import { Siren, Siret } from '#utils/helpers';
import clientAPIEntreprise, { IAPIEntrepriseResponse } from '../client';

export type IAPIEntrepriseDocumentTravauxPublics = IAPIEntrepriseResponse<{
  document_url: string;
  expires_in: number;
}>;

/**
 * GET document CIBTP
 */
export const clientApiEntrepriseCibtp = async (
  siret: Siret,
  useCase: UseCase
) => {
  return await clientAPIEntreprise(
    routes.apiEntreprise.certifications.cibtp(siret),
    mapToDomainObject,
    { useCase }
  );
};

/**
 * GET document Pro BTP
 */
export const clientApiEntrepriseProbtp = async (
  siret: Siret,
  useCase: UseCase
) => {
  return await clientAPIEntreprise(
    routes.apiEntreprise.certifications.probtp(siret),
    mapToDomainObject,
    { useCase }
  );
};

/**
 * GET document CNETP
 */
export const clientApiEntrepriseCnetp = async (
  siren: Siren,
  useCase: UseCase
) => {
  return await clientAPIEntreprise(
    routes.apiEntreprise.certifications.cnetp(siren),
    mapToDomainObject,
    { useCase }
  );
};

/**
 * GET document FNTP
 */
export const clientApiEntrepriseCarteProfessionnelleTravauxPublics = async (
  siren: Siren,
  useCase: UseCase
) => {
  return await clientAPIEntreprise(
    routes.apiEntreprise.carteProfessionnelleTravauxPublics(siren),
    mapToDomainObject,
    { useCase }
  );
};

const mapToDomainObject = (
  response: IAPIEntrepriseDocumentTravauxPublics
): IDocumentDownloader => {
  return {
    url: response.data.document_url,
  };
};
