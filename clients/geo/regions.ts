import routes from '#clients/routes';
import constants from '#models/constants';
import { httpGet } from '#utils/network';
import { IGeoElement } from '.';

type IGeoRegionResponse = {
  nom: string;
  code: string;
};

export const clientRegionsByName = async (term: string): Promise<any> => {
  const response = await httpGet(`${routes.geo.region}&nom=${term}`, {
    timeout: constants.timeout.L,
  });

  return mapToDomainObject(response.data || []);
};

const mapToDomainObject = (response: IGeoRegionResponse[]): IGeoElement[] => {
  return response.map((region) => {
    return {
      label: `${region.nom}`,
      value: region.code,
      type: 'reg',
    };
  });
};
