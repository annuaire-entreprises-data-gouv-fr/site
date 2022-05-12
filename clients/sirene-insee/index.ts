import {
  defaultCacheConfig,
  httpClientOAuthFactory,
} from '../../utils/network';
import routes from '../routes';

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

export interface InseeClientOptions {
  useFallback: boolean;
  useCache: boolean;
}

const defaultClient = httpClientOAuthFactory(
  routes.sireneInsee.auth,
  process.env.INSEE_CLIENT_ID,
  process.env.INSEE_CLIENT_SECRET
);

const fallbackClient = httpClientOAuthFactory(
  routes.sireneInsee.auth,
  process.env.INSEE_CLIENT_ID_FALLBACK,
  process.env.INSEE_CLIENT_SECRET_FALLBACK
);

export const inseeClientWrapper = async (
  url: string,
  clientOptions: InseeClientOptions
) => {
  const { useFallback, useCache } = clientOptions;
  const client = useFallback ? fallbackClient : defaultClient;

  const response = await client.get(url, {
    cache: useCache ? defaultCacheConfig : false,
    headers: {
      Accept: 'application/json',
    },
  });
  return response.data;
};

export const inseeClientGet = async (
  route: string,
  options = { useFallback: false, useCache: false } as InseeClientOptions
) => await inseeClientWrapper(route, options);
