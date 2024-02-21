import routes from '#clients/routes';
import constants from '#models/constants';
import { httpGet } from '#utils/network';
import { IGeoElement } from '.';

type IGeoEpciResponse = {
  nom: string;
  code: string;
};

const clientEpcisBySiren = async (siren: string): Promise<IGeoElement[]> => {
  const response = await httpGet<IGeoEpciResponse[]>(
    `${routes.geo.epcis}&code=${siren}`,
    {
      timeout: constants.timeout.L,
    }
  );

  return mapToDomainObject(response || []);
};

const clientEpcisByName = async (term: string): Promise<IGeoElement[]> => {
  const response = await httpGet<IGeoEpciResponse[]>(
    `${routes.geo.epcis}&nom=${term}`,
    {
      timeout: constants.timeout.L,
    }
  );

  return mapToDomainObject(response || []);
};

const mapToDomainObject = (response: IGeoEpciResponse[]): IGeoElement[] => {
  return response.map((epci) => {
    return {
      label: `${epci.nom} (EPCI)`,
      value: epci.code,
      type: 'epci',
    };
  });
};

// No need to stub as API Geo is robust and can be used for test e2e
export { clientEpcisByName, clientEpcisBySiren };
