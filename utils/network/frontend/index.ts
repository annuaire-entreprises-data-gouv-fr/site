import Axios, { AxiosRequestConfig } from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import constants from '#models/constants';

/**
 * Returns a cache-enabled axios instance
 */
export const axiosFrontendFactory = () => {
  const axiosOptions = {
    timeout: constants.timeout.XL,
  };

  const axiosInstance = setupCache(Axios.create(axiosOptions), {
    storage: undefined,
  });

  //@ts-ignore
  axiosInstance.interceptors.response.use(() => {}, errorInterceptor);

  return axiosInstance;
};

const axiosInstance = axiosFrontendFactory();

export async function httpFrontClient<T>(
  config: AxiosRequestConfig
): Promise<T> {
  const response = await axiosInstance({
    timeout: constants.timeout.L,
    cache: false,
    ...config,
  });
  return response.data;
}

/**
 * GET axios client
 * @param url
 * @param config
 * @param useCache - cache is disabled by default
 * @returns
 */
export async function httpGet<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return await httpFrontClient<T>({
    url,
    timeout: constants.timeout.L,
    ...config,
  });
}

export default httpFrontClient;
