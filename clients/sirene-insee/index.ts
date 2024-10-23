import routes from '#clients/routes';
import constants from '#models/constants';
import { IDefaultRequestConfig } from '#utils/network';
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
 * @param route
 * @param config
 * @param useFallback use fallback credentials
 * @returns
 */
export async function inseeClientGet<T>(
  route: string,
  config: IDefaultRequestConfig = {},
  useFallback = false
): Promise<T> {
  const client = useFallback ? fallbackClient : defaultClient;
  return (await client.get(route, {
    timeout: constants.timeout.S,
    ...config,
  })) as T;
}
