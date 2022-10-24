import { IGeoElement } from '.';
import constants from '../../models/constants';
import { httpGet } from '../../utils/network';
import routes from '../routes';

interface IGeoCommuneResponse {
  codesPostaux: string[];
  nom: string;
  code: string;
}

const searchCommunes = async (slug: string): Promise<any> => {
  const response = await httpGet(routes.geo.departement + slug, {
    timeout: constants.timeout.L,
  });

  return mapToDomainObject(response.data || []);
};

const mapToDomainObject = (response: IGeoCommuneResponse[]): IGeoElement[] => {
  return response.reduce(
    (communes: IGeoElement[], commune) => [
      ...communes,
      ...commune.codesPostaux.map((cp) => {
        return { label: `${commune.nom} (${cp})`, value: cp };
      }),
    ],
    []
  );
};

export { searchCommunes };
