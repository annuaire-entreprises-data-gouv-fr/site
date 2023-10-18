import { AxiosRequestConfig } from 'axios';
import { CacheRequestConfig } from 'axios-cache-interceptor';
import { defaultCacheConfig } from './utils/cache-config';

/**
 * Inner client allow us to resolve async import on module load
 *
 * i.e. when node starts or web page loads
 */
let innerClient = initClient();
async function initClient() {
  if (typeof window === 'undefined') {
    return (await import('./backend')).httpBackClient;
  } else {
    return (await import('./frontend')).httpFrontClient;
  }
}

/**
 * TO READ
 *
 * Differences between frontend clients and backend
 *
 * - Logging is different
 * - Caching is different
 */

/**
 * Default http client - any HTTP method - no cache
 * @param config
 * @returns
 */
export async function httpClient<T>(config: CacheRequestConfig): Promise<T> {
  return await (
    await innerClient
  )(config);
}

/**
 * GET http client - can use cache
 * @param url
 * @param config
 * @param useCache - cache is disabled by default
 * @returns
 */
export async function httpGet<T>(
  url: string,
  config?: AxiosRequestConfig,
  useCache = false
): Promise<T> {
  return await httpClient({
    url,
    ...config,
    cache: useCache ? defaultCacheConfig : false,
  });
}

export default httpClient;
