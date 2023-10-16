import { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { httpGet } from '#utils/network';

/**
 * GET for API Proxy api
 *
 * @param url
 * @param options
 * @param useCache by default, cache is deactivated
 * @returns
 */
async function getAPIProxy<T>(
  url: string,
  options?: AxiosRequestConfig,
  useCache = false // by default we dont cache response
): Promise<T> {
  return await httpGet(
    url,
    {
      ...options,
      headers: {
        'X-APIkey': process.env.PROXY_API_KEY || '',
        ...(options?.headers as RawAxiosRequestHeaders),
      },
    },
    useCache
  );
}

export async function clientAPIProxy<T>(
  route: string,
  options: AxiosRequestConfig,
  useCache: boolean
): Promise<T> {
  return await getAPIProxy<T>(route, options, useCache);
}
