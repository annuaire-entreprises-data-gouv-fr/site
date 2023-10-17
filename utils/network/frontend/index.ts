import Axios, { AxiosRequestConfig } from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import constants from '#models/constants';
import errorInterceptor from '../utils/error-interceptor';

/**
 * Returns a cache-enabled axios instance
 */
export const axiosFrontendFactory = () => {
  const axiosOptions = {
    timeout: constants.timeout.XL,
  };

  /**
   *
   * note for future references : we can cache request on front end (local or session storage)
   *  */
  const axiosInstance = setupCache(Axios.create(axiosOptions), {
    storage: undefined, //buildWebStorage(localStorage, 'axios-cache:'),
  });

  axiosInstance.interceptors.response.use(function (response) {
    return response;
  }, errorInterceptor);

  return axiosInstance;
};

const axiosInstance = axiosFrontendFactory();

export async function httpFrontClient<T>(
  config: AxiosRequestConfig
): Promise<T> {
  const response = await axiosInstance({
    timeout: constants.timeout.XL,
    cache: false,
    ...config,
  });
  return response.data;
}

export default httpFrontClient;
