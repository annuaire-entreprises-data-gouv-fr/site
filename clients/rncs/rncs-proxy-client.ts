import { AxiosRequestConfig } from 'axios';
import httpClient, { httpGet } from '../../utils/network';

/**
 * GET for RNCS Proxy api
 *
 * @param url
 * @param options
 * @param useCache by default, cache is deactivated
 * @returns
 */
const APIRncsProxyGet = async (
  url: string,
  options?: AxiosRequestConfig,
  useCache = false // by default we dont cache response
) =>
  await httpGet(
    url,
    {
      ...options,
      headers: {
        'X-APIkey': process.env.PROXY_API_KEY || '',
        ...options?.headers,
      },
    },
    useCache
  );

/**
 * POST for RNCS Proxy api - no cache
 *
 * @param url
 * @param options
 * @returns
 */
const APIRncsProxyPost = async (url: string, options: AxiosRequestConfig) =>
  await httpClient({
    url,
    ...options,
    headers: {
      'X-APIkey': process.env.PROXY_API_KEY || '',
      ...options?.headers,
    },
    method: 'POST',
  });

export { APIRncsProxyGet, APIRncsProxyPost };
