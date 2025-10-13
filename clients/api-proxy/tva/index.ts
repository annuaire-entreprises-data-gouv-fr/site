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
 * @returns TVA number if valid else null
 */
export const clientTVA = async (tva: TVANumber): Promise<string | null> => {
  const url = routes.proxy.tva(tva);

  const data = await clientAPIProxy<IVIESResponse>(url, {
    timeout: constants.timeout.XXL,
  });

  return data.tva;
};
