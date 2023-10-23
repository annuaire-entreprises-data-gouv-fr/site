import { IDefaultRequestConfig, httpGet } from '#utils/network';

/**
 * GET for API Proxy api
 *
 * @param route
 * @param options
 * @returns
 */
export async function clientAPIProxy<T>(
  route: string,
  options: IDefaultRequestConfig
): Promise<T> {
  return await httpGet(route, {
    ...options,
    headers: {
      'X-APIkey': process.env.PROXY_API_KEY || '',
      ...options?.headers,
    },
  });
}
