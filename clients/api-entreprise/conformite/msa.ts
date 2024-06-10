import routes from '#clients/routes';
import { IConformite } from '#models/espace-agent/conformite';
import { Siret } from '#utils/helpers';
import clientAPIEntreprise, { IAPIEntrepriseResponse } from '../client';

export type IAPIEntrepriseConformiteMSA = IAPIEntrepriseResponse<{
  status: 'up_to_date' | string;
}>;

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseConformiteMSA = async (siret: Siret) => {
  return await clientAPIEntreprise<IAPIEntrepriseConformiteMSA, IConformite>(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.conformite.msa.replace('{siret}', siret)}`,
    mapToDomainObject
  );
};

const mapToDomainObject = (response: IAPIEntrepriseConformiteMSA) => {
  return {
    isValid: response.data?.status === 'up_to_date',
    url: null,
    label: null,
  };
};
