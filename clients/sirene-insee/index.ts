import { AxiosRequestConfig } from 'axios';
import routes from '#clients/routes';
import constants from '#models/constants';
import { httpClientOAuth } from '#utils/network/backend/0auth';

/**
 * Insee client
 *
 * 0Auth client gets instanced twice :
 *
 * One default client used for most calls
 * One fallback client that use a different secret/id - used when first client gets rate limited
 *
 * NB: we want to limit instance to share the /token authentication calls
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

/**
 * Insee API client
 *
 * Two main different config options :
 * useCache : to activate result caching and avoid unecessary calls
 * useFallback : to use fallback credentials and avoid rate limiting
 *
 * @param route
 * @param options
 * @param axiosConfig
 * @returns
 */
export async function inseeClientGet<T>(
  route: string,
  options = { useFallback: false, useCache: false } as InseeClientOptions,
  axiosConfig: AxiosRequestConfig = {}
): Promise<T> {
  const { useFallback, useCache } = options;

  const client = useFallback ? fallbackClient : defaultClient;
  return (await client.get(
    route,
    { timeout: constants.timeout.S, ...axiosConfig },
    useCache
  )) as T;
}
