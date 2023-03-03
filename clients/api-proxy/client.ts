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
const getAPIProxy = async (
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
        ...(options?.headers as RawAxiosRequestHeaders),
      },
    },
    useCache
  );

const clientAPIProxy = async (
  route: string,
  options: AxiosRequestConfig,
  useCache: boolean
) => {
  const request = await getAPIProxy(route, options, useCache);

  return request.data;
};

export { clientAPIProxy };
