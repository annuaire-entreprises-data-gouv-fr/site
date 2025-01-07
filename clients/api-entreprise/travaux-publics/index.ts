import routes from '#clients/routes';
import { IDocumentDownloader } from '#models/espace-agent/travaux-publics';
import { Siren, Siret } from '#utils/helpers';
import clientAPIEntreprise, { IAPIEntrepriseResponse } from '../client';

export type IAPIEntrepriseDocumentTravauxPublics = IAPIEntrepriseResponse<{
  document_url: string;
  expires_in: number;
}>;

/**
 * GET document CIBTP
 */
export const clientApiEntrepriseCibtp = async (siret: Siret) => {
  return await clientAPIEntreprise(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.certifications.cibtp(siret)}`,
    mapToDomainObject
  );
};

/**
 * GET document Pro BTP
 */
export const clientApiEntrepriseProbtp = async (siret: Siret) => {
  return await clientAPIEntreprise(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.certifications.probtp(siret)}`,
    mapToDomainObject
  );
};

/**
 * GET document CNETP
 */
export const clientApiEntrepriseCnetp = async (siren: Siren) => {
  return await clientAPIEntreprise(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.certifications.cnetp(siren)}`,
    mapToDomainObject
  );
};

/**
 * GET document FNTP
 */
export const clientApiEntrepriseCarteProfessionnelleTravauxPublics = async (
  siren: Siren
) => {
  return await clientAPIEntreprise(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.carteProfessionnelleTravauxPublics(siren)}`,
    mapToDomainObject
  );
};

const mapToDomainObject = (
  response: IAPIEntrepriseDocumentTravauxPublics
): IDocumentDownloader => {
  return {
    url: response.data.document_url,
  };
};
