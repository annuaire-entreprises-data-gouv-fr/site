import routes from '#clients/routes';
import constants from '#models/constants';
import { httpGet } from '#utils/network';
import { IGeoElement } from '.';

interface IGeoDepartementResponse {
  nom: string;
  code: string;
}

const clientGeoDepartements = async (slug: string): Promise<any> => {
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

export { clientGeoDepartements };
