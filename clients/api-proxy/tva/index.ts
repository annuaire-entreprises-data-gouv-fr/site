import { clientAPIProxy } from "#clients/api-proxy/client";
import routes from "#clients/routes";
import constants from "#models/constants";
import type { TVANumber } from "#utils/helpers";

type IVIESResponse = {
  tva: string | null;
};

/**
 * Specific exception raised by VIES endpoint
 */
export class TVAUserException extends Error {
  constructor(public message: string) {
    super(message);
    this.message = message;
    this.name = "TVAUserException";
  }
}

/**
 * Call VIES to validate a French TVA number
 * @param tva
 * @returns TVA number if valid else null
 */
export const clientTVA = async (tva: TVANumber): Promise<string | null> => {
  const url = routes.proxy.tva(tva);

  try {
    const data = await clientAPIProxy<IVIESResponse>(url, {
      timeout: constants.timeout.XXL,
    });

    return data.tva;
  } catch (e: any) {
    if (e instanceof Error) {
      throw new TVAUserException(e.message);
    }

    throw e;
  }
};
