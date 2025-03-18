import routes from '#clients/routes';
import { IConformite } from '#models/espace-agent/conformite';
import { UseCase } from '#models/use-cases';
import { Siret } from '#utils/helpers';
import clientAPIEntreprise, { IAPIEntrepriseResponse } from '../client';

export type IAPIEntrepriseConformiteMSA = IAPIEntrepriseResponse<{
  status: 'up_to_date' | string;
}>;

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseConformiteMSA = async (
  siret: Siret,
  useCase?: UseCase
) => {
  return await clientAPIEntreprise<IAPIEntrepriseConformiteMSA, IConformite>(
    routes.apiEntreprise.conformite.msa(siret),
    mapToDomainObject,
    { useCase }
  );
};

const mapToDomainObject = (response: IAPIEntrepriseConformiteMSA) => {
  return {
    isValid: response.data?.status === 'up_to_date',
    url: null,
    label: null,
  };
};
