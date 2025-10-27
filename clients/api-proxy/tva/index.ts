import { clientAPIProxy } from "#clients/api-proxy/client";
import routes from "#clients/routes";
import constants from "#models/constants";
import type { TVANumber } from "#utils/helpers";

type IVIESResponse = {
  tva: string | null;
};

/**
 * Call VIES to validate a French TVA number
 * @param tva
 * @param useCache : whether to use the cache or not
 * @returns TVA number if valid else null
 */
export const clientTVA = async (
  tva: TVANumber,
  useCache = true
): Promise<string | null> => {
  let url = routes.proxy.tva(tva);

  if (!useCache) {
    url += "?useCache=false";
  }

  const data = await clientAPIProxy<IVIESResponse>(url, {
    timeout: constants.timeout.XXL,
  });

  return data.tva;
};
