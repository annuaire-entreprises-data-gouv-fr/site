import routes from '#clients/routes';
import { datapassApiClient } from './client';
import {
  IDatapassDemandeResponse,
  IDatapassHabilitationResponse,
} from './interface';

/**
 * Datapass
 * https://datapass.api.gouv.fr/
 */
export const getHabilitation = async (
  habilitationId: number
): Promise<IDatapassHabilitationResponse> => {
  const route = routes.datapass.habilitations.getById(habilitationId);
  const response = await datapassApiClient.fetch<IDatapassHabilitationResponse>(
    route,
    {
      method: 'GET',
    }
  );
  return response;
};

export const getDemande = async (
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

export default {
  getHabilitation,
  getDemande,
};
