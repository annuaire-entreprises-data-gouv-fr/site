import routes from '#clients/routes';
import { stubClient } from '#clients/stub-client-with-snaphots';
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

// This API can timeout, so we need to stub it
const stubbedClientEpcisByName = stubClient({ clientEpcisByName });
export { stubbedClientEpcisByName as clientEpcisByName, clientEpcisBySiren };
