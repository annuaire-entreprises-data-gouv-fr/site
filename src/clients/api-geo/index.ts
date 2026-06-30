import routes from "#/clients/routes";
import constants from "#/models/constants";
import { httpGet } from "#/utils/network";
import type { GeoResponse, IGeoCommune } from "./interface";

/**
 * GEO
 * https://geo.api.gouv.fr/
 */
export const clientGeo = async (codeInsee: string): Promise<IGeoCommune> => {
  const route = routes.geo.commune(codeInsee);
  const data = await httpGet<GeoResponse>(route, {
    params: { codeInsee },
    timeout: constants.timeout.XL,
  });

  return data;
};
