import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import constants from '../../models/constants';
import redisStorage from './redis-storage';
import { CacheRequestConfig, setupCache } from 'axios-cache-interceptor';
import logInterceptor from './log-interceptor';
import errorInterceptor from './error-interceptor';

const DEFAULT_AGE = 1000 * 60 * 15;

/**
 * Returns a cache-enabled axios instance
 */
export const cachedAxiosInstanceFactory = () => {
  return setupCache(Axios.create(), {
    storage: redisStorage,
    // ignore cache-control headers as some API like sirene return 'no-cache' headers
    headerInterpreter: () => DEFAULT_AGE,
    debug: console.log,
  });
};

const axiosInstanceWithCache = cachedAxiosInstanceFactory();
/*
 * log every response into STDOUT
 */
axiosInstanceWithCache.interceptors.response.use(
  logInterceptor,
  errorInterceptor
);

/**
 * Default axios client - not cached by default
 * @param config
 * @returns
 */
const httpClient = async (config: CacheRequestConfig): Promise<AxiosResponse> =>
  await axiosInstanceWithCache({
    timeout: constants.timeout.default,
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
    timeout: constants.timeout.default,
    ...config,
    cache: useCache ? defaultCacheConfig : false,
  });

export const defaultCacheConfig = {
  // 15 minutes lifespan as average session is ~ 3 min.
  ttl: DEFAULT_AGE,

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
