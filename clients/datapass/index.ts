import routes from '#clients/routes';
import { datapassApiClient } from './client';
import { IDatapassDemandeResponse } from './interface';

export const getDatapassDemande = async (
  demandeId: number
): Promise<IDatapassDemandeResponse> => {
  const route = routes.datapass.demandes.getById(demandeId);
  const response = await datapassApiClient.fetch<IDatapassDemandeResponse>(
    route,
    {
      method: 'GET',
    }
  );
  return response;
};
