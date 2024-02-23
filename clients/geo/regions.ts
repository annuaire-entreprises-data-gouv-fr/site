import routes from '#clients/routes';
import constants from '#models/constants';
import { httpGet } from '#utils/network';
import { IGeoElement } from '.';

type IGeoRegionResponse = {
  nom: string;
  code: string;
};

const clientRegionsByName = async (term: string): Promise<IGeoElement[]> => {
  const response = await httpGet<IGeoRegionResponse[]>(
    `${routes.geo.regions}&nom=${term}`,
    {
      timeout: constants.timeout.L,
    }
  );

  return mapToDomainObject(response || []);
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

// No need to stub as API Geo is robust and can be used for test e2e
export { clientRegionsByName };
