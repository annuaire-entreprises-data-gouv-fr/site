import { HttpUnauthorizedError } from '#clients/exceptions';
import routes from '#clients/routes';
import constants from '#models/constants';
import { Siren } from '#utils/helpers';
import { httpGet } from '#utils/network';

export type IAPIEntrepriseConformiteFiscale = {
  data: {
    document_url: string;
    document_url_expires_in: number;
    date_delivrance_attestation: string;
    date_periode_analysee: string;
  };
  links: {};
  meta: {};
};

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseConformiteFiscale = async (
  siren: Siren,
  useCache = true
) => {
  if (!process.env.API_ENTREPRISE_URL || !process.env.API_ENTREPRISE_TOKEN) {
    throw new HttpUnauthorizedError('Missing API Entreprise credentials');
  }

  const response = await httpGet(
    `${process.env.API_ENTREPRISE_URL}${routes.apiEntreprise.conformite.fiscale}${siren}/attestation_fiscale`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_ENTREPRISE_TOKEN}`,
      },
      timeout: constants.timeout.XL,
      params: {
        object: 'espace-agent-public',
        context: 'annuaire-entreprises',
        recipient: 13002526500013,
      },
    },
    useCache
  );

  return mapToDomainObject(response.data);
};

const mapToDomainObject = (response: IAPIEntrepriseConformiteFiscale) => {
  return { url: response.data.document_url, isValid: null };
};
