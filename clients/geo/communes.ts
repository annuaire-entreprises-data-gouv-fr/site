import routes from '#clients/routes';
import constants from '#models/constants';
import { httpGet } from '#utils/network';
import { IGeoElement } from '.';

interface IGeoCommuneResponse {
  codesPostaux: string[];
  nom: string;
  code: string;
}

const clientGeoCommunes = async (slug: string): Promise<any> => {
  const response = await httpGet(routes.geo.commune + slug, {
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

export { clientGeoCommunes };
