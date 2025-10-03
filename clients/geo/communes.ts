import routes from "#clients/routes";
import constants from "#models/constants";
import { httpGet } from "#utils/network";
import type { IGeoElement } from ".";

type IGeoCommuneResponse = {
  codesPostaux: string[];
  nom: string;
  code: string;
  departement?: { code: string; nom: string };
};

export const clientCommunesByName = async (
  slug: string
): Promise<IGeoElement[]> => {
  const query = `fields=codesPostaux&format=json&nom=${slug}&fields=departement`;
  const response = await httpGet<IGeoCommuneResponse[]>(
    `${routes.geo.communes}?${query}`,
    {
      timeout: constants.timeout.L,
    }
  );

  return mapToDomainObject(response || []);
};

export const clientCommuneByCp = async (cp: string): Promise<IGeoElement[]> => {
  const query = `fields=codesPostaux&format=json&codePostal=${cp}`;
  const response = await httpGet<IGeoCommuneResponse[]>(
    `${routes.geo.communes}?${query}`,
    {
      timeout: constants.timeout.L,
    }
  );

  return mapToDomainObject(response || []);
};

const mapToDomainObject = (response: IGeoCommuneResponse[]): IGeoElement[] =>
  response
    .sort((a, b) => b.codesPostaux.length - a.codesPostaux.length)
    .reduce(
      (communes: IGeoElement[], commune: IGeoCommuneResponse) => [
        ...communes,
        ...(["Paris", "Lyon", "Marseille"].indexOf(commune.nom) === -1
          ? [
              {
                type: "insee",
                value: commune.code,
                label: `${commune.nom}${
                  commune.departement?.code
                    ? ` (${commune.departement?.code})`
                    : ""
                } — toute la commune`,
              } as IGeoElement,
            ]
          : []),
        ...(commune.codesPostaux.length > 1
          ? commune.codesPostaux.map(
              (cp) =>
                ({
                  label: `${commune.nom} (${cp})`,
                  value: cp,
                  type: "cp",
                }) as IGeoElement
            )
          : []),
      ],
      []
    );
