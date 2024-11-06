import routes from '#clients/routes';
import { stubClient } from '#clients/stub-client-with-snaphots';
import constants from '#models/constants';
import { httpGet } from '#utils/network';
import { IGeoElement } from '.';

type IGeoCommuneResponse = {
  codesPostaux: string[];
  nom: string;
  code: string;
  departement?: { code: string; nom: string };
};

const clientCommunesByName = async (slug: string): Promise<IGeoElement[]> => {
  const response = await httpGet<IGeoCommuneResponse[]>(
    `${routes.geo.communes}&nom=${slug}&fields=departement`,
    {
      timeout: constants.timeout.L,
    }
  );

  return mapToDomainObject(response || []);
};

const clientCommuneByCp = async (cp: string): Promise<IGeoElement[]> => {
  const response = await httpGet<IGeoCommuneResponse[]>(
    `${routes.geo.communes}&codePostal=${cp}`,
    {
      timeout: constants.timeout.L,
    }
  );

  return mapToDomainObject(response || []);
};

const mapToDomainObject = (response: IGeoCommuneResponse[]): IGeoElement[] => {
  return response
    .sort((a, b) => b.codesPostaux.length - a.codesPostaux.length)
    .reduce(
      (communes: IGeoElement[], commune: IGeoCommuneResponse) => [
        ...communes,
        ...(['Paris', 'Lyon', 'Marseille'].indexOf(commune.nom) === -1
          ? [
              {
                type: 'insee',
                value: commune.code,
                label: `${commune.nom}${
                  commune.departement?.code
                    ? ` (${commune.departement?.code})`
                    : ''
                } — toute la commune`,
              } as IGeoElement,
            ]
          : []),
        ...(commune.codesPostaux.length > 1
          ? commune.codesPostaux.map((cp) => {
              return {
                label: `${commune.nom} (${cp})`,
                value: cp,
                type: 'cp',
              } as IGeoElement;
            })
          : []),
      ],
      []
    );
};

// We need to stub this API because it can timeout
const stubbedClientCommunesByName = stubClient({ clientCommunesByName });
export {
  clientCommuneByCp,
  stubbedClientCommunesByName as clientCommunesByName,
};
