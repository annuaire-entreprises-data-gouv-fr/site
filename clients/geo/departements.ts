import routes from '#clients/routes';
import stubClientWithSnapshots from '#clients/stub-client-with-snaphots';
import constants from '#models/constants';
import { httpGet } from '#utils/network';
import { IGeoElement } from '.';

type IGeoDepartementResponse = {
  nom: string;
  code: string;
};

const clientDepartementsByName = async (slug: string): Promise<any> => {
  const response = await httpGet<IGeoDepartementResponse[]>(
    `${routes.geo.departement}&nom=${slug}`,
    {
      timeout: constants.timeout.L,
    }
  );
  return mapToDomainObject(response || []);
};

const clientDepartementByCode = async (code: string): Promise<any> => {
  const response = await httpGet<IGeoDepartementResponse[]>(
    `${routes.geo.departement}&code=${code}`,
    {
      timeout: constants.timeout.L,
    }
  );
  return mapToDomainObject(response || []);
};

const mapToDomainObject = (
  response: IGeoDepartementResponse[]
): IGeoElement[] => {
  return response.map((departement) => {
    return {
      label: `${departement.nom} (${departement.code})`,
      value: departement.code,
      type: 'dep',
    };
  });
};

const stubbedClientDepartementsByName = stubClientWithSnapshots({
  clientDepartementsByName,
});
const stubbedClientDepartementByCode = stubClientWithSnapshots({
  clientDepartementByCode,
});
export {
  stubbedClientDepartementByCode as clientDepartementByCode,
  stubbedClientDepartementsByName as clientDepartementsByName,
};
