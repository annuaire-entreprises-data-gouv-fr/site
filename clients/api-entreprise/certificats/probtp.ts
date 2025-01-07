import routes from '#clients/routes';
import { ICertificatTravauxPublics } from '#models/espace-agent/travaux-publics';
import { Siret } from '#utils/helpers';
import clientAPIEntreprise, { IAPIEntrepriseResponse } from '../client';

export type IAPIEntrepriseProbtp = IAPIEntrepriseResponse<{
  document_url: string;
  expires_in: number;
}>;

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseProbtp = async (siret: Siret) => {
  return await clientAPIEntreprise(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.certifications.probtp(siret)}`,
    mapToDomainObject
  );
};

const mapToDomainObject = ({
  data,
}: IAPIEntrepriseProbtp): ICertificatTravauxPublics => {
  return {
    documentUrl: data.document_url,
    expiresIn: data.expires_in,
  };
};
