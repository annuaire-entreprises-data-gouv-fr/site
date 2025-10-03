import routes from "#clients/routes";
import constants from "#models/constants";
import { httpGet } from "#utils/network";
import type { IGeoElement } from ".";

type IGeoRegionResponse = {
  nom: string;
  code: string;
};

export const clientRegionsByName = async (
  term: string
): Promise<IGeoElement[]> => {
  const response = await httpGet<IGeoRegionResponse[]>(
    `${routes.geo.regions}?fields=nom,code&nom=${term}`,
    {
      timeout: constants.timeout.L,
    }
  );

  return mapToDomainObject(response || []);
};

const mapToDomainObject = (response: IGeoRegionResponse[]): IGeoElement[] =>
  response.map((region) => ({
    label: `${region.nom}`,
    value: region.code,
    type: "reg",
  }));
