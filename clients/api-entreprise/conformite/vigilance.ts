import { HttpUnauthorizedError } from '#clients/exceptions';
import routes from '#clients/routes';
import constants from '#models/constants';
import { Siren } from '#utils/helpers';
import { httpGet } from '#utils/network';

export type IAPIEntrepriseConformiteVigilance = {
  data: {
    entity_status: {
      code: 'ok';
      libelle: string;
      description: string;
    };
    date_debut_validite: string;
    date_fin_validite: string;
    code_securite: string;
    document_url: string;
    document_url_expires_in: number;
  };
};

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseConformiteVigilance = async (siren: Siren) => {
  if (!process.env.API_ENTREPRISE_URL || !process.env.API_ENTREPRISE_TOKEN) {
    throw new HttpUnauthorizedError('Missing API Entreprise credentials');
  }

  // never cache any API Entreprise request
  const useCache = false;

  const response = await httpGet<IAPIEntrepriseConformiteVigilance>(
    `${process.env.API_ENTREPRISE_URL}${routes.apiEntreprise.conformite.vigilance}${siren}/attestation_vigilance`,
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

  return mapToDomainObject(response);
};

const mapToDomainObject = (response: IAPIEntrepriseConformiteVigilance) => {
  return {
    url: response.data.document_url,
    isValid: response.data?.entity_status?.code === 'ok',
    label: 'Attestation de vigilance',
  };
};
