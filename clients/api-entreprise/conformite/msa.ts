import routes from '#clients/routes';
import { IConformite } from '#models/espace-agent/donnees-restreintes-entreprise';
import { Siret } from '#utils/helpers';
import clientAPIEntreprise from '../client';

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
export const clientApiEntrepriseConformiteMSA = async (
  siret: Siret,
  recipientSiret?: string
) => {
  return await clientAPIEntreprise<IAPIEntrepriseConformiteMSA, IConformite>(
    `${process.env.API_ENTREPRISE_URL}${routes.apiEntreprise.conformite.msa}${siret}/conformite_cotisations`,
    mapToDomainObject,
    recipientSiret
  );
};

const mapToDomainObject = (response: IAPIEntrepriseConformiteMSA) => {
  return {
    isValid: response.data?.status === 'up_to_date',
    url: null,
    label: null,
  };
};
