import routes from '#clients/routes';
import constants from '#models/constants';
import { httpGet } from '#utils/network';
import { IGeoElement } from '.';

type IGeoDepartementResponse = {
  nom: string;
  code: string;
};

const clientDepartementsByName = async (slug: string): Promise<any> => {
  const response = await httpGet(`${routes.geo.departement}&nom=${slug}`, {
    timeout: constants.timeout.L,
  });
  return mapToDomainObject(response.data || []);
};

const clientDepartementByCode = async (code: string): Promise<any> => {
  const response = await httpGet(`${routes.geo.departement}&code=${code}`, {
    timeout: constants.timeout.L,
  });
  return mapToDomainObject(response.data || []);
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

export { clientDepartementsByName, clientDepartementByCode };
