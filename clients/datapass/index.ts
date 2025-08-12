import routes from '#clients/routes';
import { datapassApiClient } from './client';
import { IDatapassHabilitationResponse } from './interface';

/**
 * Datapass
 * https://datapass.api.gouv.fr/
 */
export const getGroupsByEmail = async (
  habilitationId: string
): Promise<IDatapassHabilitationResponse> => {
  const route = routes.datapass.habilitations.getById(habilitationId);
  const response = await datapassApiClient.fetch<IDatapassHabilitationResponse>(
    route,
    {
      method: 'GET',
    }
  );
  return mapToDomainObject(response);
};

const mapToDomainObject = (
  response: IDatapassHabilitationResponse
): IDatapassHabilitationResponse => {
  return response;
};

export default {
  getGroupsByEmail,
};
