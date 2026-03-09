import routes from "#clients/routes";
import constants from "#models/constants";
import { httpGet } from "#utils/network";
import type { IGeoElement } from ".";

interface IGeoCommuneResponse {
  code: string;
  codesPostaux: string[];
  departement?: { code: string; nom: string };
  nom: string;
}

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
    .flatMap((commune) => {
      const elements: IGeoElement[] = [];

      if (!["Paris", "Lyon", "Marseille"].includes(commune.nom)) {
        elements.push({
          type: "insee",
          value: commune.code,
          label: `${commune.nom}${
            commune.departement?.code ? ` (${commune.departement.code})` : ""
          } — toute la commune`,
        });
      }

      if (commune.codesPostaux.length > 1) {
        elements.push(
          ...commune.codesPostaux.map((cp) => ({
            label: `${commune.nom} (${cp})`,
            value: cp,
            type: "cp" as const,
          }))
        );
      }

      return elements;
    });
