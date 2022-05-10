import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import constants from '../../models/constants';
import httpClientOAuthFactory from './0auth';
import redisStorage from './redis-storage';
import { setupCache } from 'axios-cache-interceptor';
import logInterceptor from './log-interceptor';
import errorInterceptor from './error-interceptor';

/**
 *  WARNING : calling setupCache seems to have side effects in dev
 */
export const axiosInstanceWithCache = setupCache(Axios.create(), {
  storage: redisStorage,
  debug: console.log,
});

/*
 * log every response into STDOUT
 */
axiosInstanceWithCache.interceptors.response.use(
  logInterceptor,
  errorInterceptor
);

/**
 * Default axios client - not cached
 * @param config
 * @returns
 */
const httpClient = async (
  config: AxiosRequestConfig
): Promise<AxiosResponse> => {
  return await axiosInstanceWithCache({
    timeout: constants.timeout.default,
    ...config,
    cache: false,
  });
};

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
) => {
  if (useCache) {
    return await httpGetCached(url, config);
  }
  return await httpClient({
    url,
    timeout: constants.timeout.default,
    ...config,
  });
};

/**
 * Cached GET axios client
 * @param url
 * @param config
 * @returns
 */
const httpGetCached = async (url: string, config?: AxiosRequestConfig) => {
  return await axiosInstanceWithCache.get(url, {
    cache: defaultCacheConfig,
    timeout: constants.timeout.default,
    ...config,
  });
};

export const defaultCacheConfig = {
  // 10 minutes lifespan as average session is ~ 3 min.
  ttl: 1000 * 60 * 10,

  // only cache 200
  cachePredicate: {
    statusCheck: (status: number) => status >= 200 && status < 300,
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

export { httpClientOAuthFactory, httpClient, httpGet };

export default httpClient;
