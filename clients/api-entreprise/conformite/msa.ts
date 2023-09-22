import { HttpUnauthorizedError } from '#clients/exceptions';
import routes from '#clients/routes';
import constants from '#models/constants';
import { Siret } from '#utils/helpers';
import { httpGet } from '#utils/network';

export type IAPIEntrepriseConformiteMSA = {
  data: {
    status: 'up_to_date' | string;
  };
  links: {};
  meta: {};
};

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseConformiteMSA = async (siret: Siret) => {
  if (!process.env.API_ENTREPRISE_URL || !process.env.API_ENTREPRISE_TOKEN) {
    throw new HttpUnauthorizedError('Missing API Entreprise credentials');
  }

  // never cache any API Entreprise request
  const useCache = false;

  const response = await httpGet(
    `${process.env.API_ENTREPRISE_URL}${routes.apiEntreprise.conformite.msa}${siret}/conformite_cotisations`,
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

const mapToDomainObject = (response: IAPIEntrepriseConformiteMSA) => {
  return {
    isValid: response.data?.status === 'up_to_date',
    url: null,
    label: null,
  };
};
