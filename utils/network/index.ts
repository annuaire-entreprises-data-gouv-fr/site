import { AxiosRequestConfig } from 'axios';
import { CacheRequestConfig } from 'axios-cache-interceptor';
import { defaultCacheConfig } from './utils/cache-config';

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
  if (typeof window === 'undefined') {
    const { httpBackClient } = await import('./backend');
    return httpBackClient<T>(config);
  } else {
    const { httpFrontClient } = await import('./frontend');
    return httpFrontClient<T>(config);
  }
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
