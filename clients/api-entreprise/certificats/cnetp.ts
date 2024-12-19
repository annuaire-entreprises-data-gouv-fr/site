import routes from '#clients/routes';
import { ICnetp } from '#models/espace-agent/certificats/cnetp';
import { Siren } from '#utils/helpers';
import clientAPIEntreprise, { IAPIEntrepriseResponse } from '../client';

export type IAPIEntrepriseCnetp = IAPIEntrepriseResponse<{
  document_url: string; // https://storage.entreprise.api.gouv.fr/siade/xxxxxx.pdf
  expires_in: number; // 600
}>;

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseCnetp = async (siren: Siren) => {
  return await clientAPIEntreprise(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.certifications.cnetp(siren)}`,
    mapToDomainObject
  );
};

const mapToDomainObject = ({ data }: IAPIEntrepriseCnetp): ICnetp => {
  return {
    documentUrl: data.document_url,
    expiresIn: data.expires_in,
  };
};
