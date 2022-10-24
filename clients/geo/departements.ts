import { IGeoElement } from '.';
import constants from '../../models/constants';
import { httpGet } from '../../utils/network';
import routes from '../routes';

interface IGeoDepartementResponse {
  nom: string;
  code: string;
}

const searchDepartements = async (slug: string): Promise<any> => {
  const response = await httpGet(routes.geo.departement + slug, {
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
    };
  });
};

export { searchDepartements };
