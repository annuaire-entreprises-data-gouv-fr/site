import routes from '#clients/routes';
import { ICertificatTravauxPublics } from '#models/espace-agent/travaux-publics';
import { Siret } from '#utils/helpers';
import clientAPIEntreprise, { IAPIEntrepriseResponse } from '../client';

export type IAPIEntrepriseCibtp = IAPIEntrepriseResponse<{
  document_url: string; // https://storage.entreprise.api.gouv.fr/siade/xxxxxx.pdf
  expires_in: number; // 600
}>;

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseCibtp = async (siret: Siret) => {
  return await clientAPIEntreprise(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.certifications.cibtp(siret)}`,
    mapToDomainObject
  );
};

const mapToDomainObject = ({
  data,
}: IAPIEntrepriseCibtp): ICertificatTravauxPublics => {
  return {
    documentUrl: data.document_url,
    expiresIn: data.expires_in,
  };
};
