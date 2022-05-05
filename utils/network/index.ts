import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import constants from '../../models/constants';
import handleError from './handle-errors';
import httpClientOAuthFactory from './Oauth';
import redisStorage from './redis-storage';
import { setupCache } from 'axios-cache-interceptor';

const axiosInstanceWithCache = setupCache(Axios, {
  storage: redisStorage,
});

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
  })
    .then((response) => response)
    .catch((error) => handleError(error));
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
  return await axiosInstanceWithCache
    .get(url, {
      cache: {
        // 5 minutes lifespan as average session is < 5 min.
        ttl: 1000 * 60 * 5,

        // only cache 200
        cachePredicate: {
          statusCheck: (status) => status === 200,
        },

        // If we should return a old (possibly expired) cache when the current request failed
        // to get a valid response because of a network error, invalid status or etc.
        staleIfError: false,
      },
      timeout: constants.timeout.default,
      ...config,
    })
    .then((response) => response)
    .catch((error) => handleError(error));
};

export { httpClientOAuthFactory, httpClient, httpGet };

export default httpClient;
