import routes from '#clients/routes';
import constants from '#models/constants';
import { httpGet } from '#utils/network';
import { IGeoElement } from '.';

type IGeoCommuneResponse = {
  codesPostaux: string[];
  nom: string;
  code: string;
};

const clientCommunesByName = async (slug: string): Promise<any> => {
  const response = await httpGet(`${routes.geo.commune}&nom=${slug}`, {
    timeout: constants.timeout.L,
  });

  return mapToDomainObject(response.data || []);
};

const clientCommuneByCp = async (cp: string): Promise<any> => {
  const response = await httpGet(`${routes.geo.commune}&codePostal=${cp}`, {
    timeout: constants.timeout.L,
  });

  return mapToDomainObject(response.data || []);
};

const mapToDomainObject = (response: IGeoCommuneResponse[]): IGeoElement[] => {
  return response
    .sort((a, b) => b.codesPostaux.length - a.codesPostaux.length)
    .reduce(
      (communes: IGeoElement[], commune) => [
        ...communes,
        ...(['Paris', 'Lyon', 'Marseille'].indexOf(commune.nom) === -1
          ? [
              {
                type: 'insee',
                value: commune.code,
                label: `${commune.nom} (Toute la ville)`,
              },
            ]
          : []),
        ...(commune.codesPostaux.length > 1
          ? commune.codesPostaux.map((cp) => {
              return { label: `${commune.nom} (${cp})`, value: cp, type: 'cp' };
            })
          : []),
      ],
      []
    );
};

export { clientCommunesByName, clientCommuneByCp };
