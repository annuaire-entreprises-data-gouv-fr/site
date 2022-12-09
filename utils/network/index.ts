import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import constants from '../../models/constants';
import redisStorage from './redis-storage';
import { CacheRequestConfig, setupCache } from 'axios-cache-interceptor';
import { logInterceptor, addStartTimeInterceptor } from './log-interceptor';
import errorInterceptor from './error-interceptor';

export const CACHE_TIMEOUT = 1000 * 60 * 15;

/**
 * Returns a regular axios instance
 */
export const defaultAxiosInstanceFactory = (timeout = constants.timeout.L) => {
  const regularInstance = Axios.create({ timeout });

  regularInstance.interceptors.request.use(addStartTimeInterceptor, (err) =>
    Promise.reject(err)
  );

  regularInstance.interceptors.response.use(logInterceptor, errorInterceptor);

  return regularInstance;
};

/**
 * Returns a cache-enabled axios instance
 */
export const cachedAxiosInstanceFactory = () => {
  const cachedInstance = setupCache(Axios.create(), {
    storage: redisStorage(CACHE_TIMEOUT),
    // ignore cache-control headers as some API like sirene return 'no-cache' headers
    headerInterpreter: () => CACHE_TIMEOUT,
    debug: console.info,
  });

  cachedInstance.interceptors.request.use(addStartTimeInterceptor, (err) =>
    Promise.reject(err)
  );

  //@ts-ignore
  cachedInstance.interceptors.response.use(logInterceptor, errorInterceptor);

  return cachedInstance;
};

const axiosInstanceWithCache = cachedAxiosInstanceFactory();

/**
 * Default axios client - not cached by default
 * @param config
 * @returns
 */
const httpClient = async (config: CacheRequestConfig): Promise<AxiosResponse> =>
  await axiosInstanceWithCache({
    timeout: constants.timeout.L,
    cache: false,
    ...config,
  });

/**
 * GET axios client
 * @param url
 * @param config
 * @param useCache - cache is disabled by default
 * @returns
 */
const httpGet = async (
  url: string,
  config?: AxiosRequestConfig,
  useCache = false
) =>
  await httpClient({
    url,
    timeout: constants.timeout.L,
    ...config,
    cache: useCache ? defaultCacheConfig : false,
  });

export const defaultCacheConfig = {
  // 15 minutes lifespan as average session is ~ 3 min.
  ttl: CACHE_TIMEOUT,

  // only cache 200
  cachePredicate: {
    statusCheck: (status: number) => {
      return status >= 200 && status < 300;
    },
    responseMatch: ({ data }: { data: any }) => {
      // only caches if the response is not fallback
      const isFallback = !!data?.metadata?.isFallback;
      return !isFallback;
    },
  },

  // If we should return a old (possibly expired) cache when the current request failed
  // to get a valid response because of a network error, invalid status or etc.
  staleIfError: false,
};

export { httpClient, httpGet };

export default httpClient;
