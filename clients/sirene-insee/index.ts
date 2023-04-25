import { AxiosRequestConfig } from 'axios';
import routes from '#clients/routes';
import constants from '#models/constants';
import { httpClientOAuth } from '#utils/network/0auth';

/**
 * API SIRENE by INSEE
 *
 * This route calls the official INSEE API, that has several limitations :
 * instable + not many concurrent request allowed.
 *
 * The idea is to only call it when the Etalab SIRENE does not answer :
 * - API Etalab is down
 * - requested company is non-diffusible
 * - requested company is very recent and API Etalab is not yet up to dat
 * - requested company does not exist
 *
 * IN all three first cases, API SIRENE by INSEE can answer, and we map the answer to the UniteLegale type
 *
 */

export type InseeClientOptions = {
  useFallback: boolean;
  useCache: boolean;
};

const defaultClient = new httpClientOAuth(
  routes.sireneInsee.auth,
  process.env.INSEE_CLIENT_ID,
  process.env.INSEE_CLIENT_SECRET
);

const fallbackClient = new httpClientOAuth(
  routes.sireneInsee.auth,
  process.env.INSEE_CLIENT_ID_FALLBACK,
  process.env.INSEE_CLIENT_SECRET_FALLBACK
);

export const inseeClientGet = async (
  route: string,
  options = { useFallback: false, useCache: false } as InseeClientOptions,
  axiosConfig: AxiosRequestConfig = {}
) => {
  const { useFallback, useCache } = options;

  const client = useFallback ? fallbackClient : defaultClient;
  return await client.get(
    route,
    { timeout: constants.timeout.XS, ...axiosConfig },
    useCache
  );
};
