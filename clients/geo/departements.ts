import routes from '#clients/routes';
import constants from '#models/constants';
import { httpGet } from '#utils/network';
import { IGeoElement } from '.';

type IGeoDepartementResponse = {
  nom: string;
  code: string;
};

const clientDepartementsByName = async (
  slug: string
): Promise<IGeoElement[]> => {
  const response = await httpGet<IGeoDepartementResponse[]>(
    `${routes.geo.departements}&nom=${slug}`,
    {
      timeout: constants.timeout.L,
    }
  );
  return mapToDomainObject(response || []);
};

const clientDepartementByCode = async (
  code: string
): Promise<IGeoElement[]> => {
  const response = await httpGet<IGeoDepartementResponse[]>(
    `${routes.geo.departements}&code=${code}`,
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

// No need to stub as API Geo is robust and can be used for test e2e
export { clientDepartementByCode, clientDepartementsByName };
