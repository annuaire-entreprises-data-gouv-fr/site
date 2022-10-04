import constants from '../../models/constants';
import httpClientOAuthGetFactory from '../../utils/network/0auth';
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

const defaultGetClient = httpClientOAuthGetFactory(
  routes.sireneInsee.auth,
  process.env.INSEE_CLIENT_ID,
  process.env.INSEE_CLIENT_SECRET
);

const fallbackGetClient = httpClientOAuthGetFactory(
  routes.sireneInsee.auth,
  process.env.INSEE_CLIENT_ID_FALLBACK,
  process.env.INSEE_CLIENT_SECRET_FALLBACK
);

export const inseeClientGet = async (
  route: string,
  options = { useFallback: false, useCache: false } as InseeClientOptions
) => {
  const { useFallback, useCache } = options;
  const getClient = useFallback ? fallbackGetClient : defaultGetClient;

  return await getClient(route, { timeout: constants.timeout.L }, useCache);
};
