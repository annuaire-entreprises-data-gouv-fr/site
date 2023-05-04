import http from 'http';
import https from 'https';
import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  AxiosCacheInstance,
  CacheRequestConfig,
  setupCache,
} from 'axios-cache-interceptor';
import constants from '#models/constants';
import errorInterceptor from './error-interceptor';
import { logInterceptor, addStartTimeInterceptor } from './log-interceptor';
import redisStorage from './redis-storage';

export const CACHE_TIMEOUT = 1000 * 60 * 15;

/**
 * Limit the number of sockets allocated per distant hosts and to reuse sockets
 */
const agentOptions = {
  keepAlive: true, // Keep sockets around even when there are no outstanding requests, so they can be used for future requests without having to reestablish a TCP connection. Defaults to false
  keepAliveMsecs: 1000, // When using the keepAlive option, specifies the initial delay for TCP Keep-Alive packets. Ignored when the keepAlive option is false or undefined. Defaults to 1000.
  maxSockets: 128, // Maximum number of sockets to allow per host. Defaults to Infinity.
  maxFreeSockets: 128, // Maximum number of sockets to leave open in a free state. Only relevant if keepAlive is set to true. Defaults to 256.
};

/**
 * Returns a regular axios instance - no cache enabled
 */
export const axiosInstanceFactory = (
  timeout = constants.timeout.L
): AxiosCacheInstance => {
  const axiosOptions = {
    timeout,
    httpsAgent: new https.Agent(agentOptions),
    httpAgent: new http.Agent(agentOptions),
  };

  const axiosInstance = setupCache(Axios.create(axiosOptions), {
    storage: redisStorage(CACHE_TIMEOUT),
    // ignore cache-control headers as some API like sirene return 'no-cache' headers
    headerInterpreter: () => CACHE_TIMEOUT,
    // eslint-disable-next-line no-console
    debug: console.info,
  });

  //@ts-ignore
  axiosInstance.interceptors.request.use(addStartTimeInterceptor, (err) =>
    Promise.reject(err)
  );

  //@ts-ignore
  axiosInstance.interceptors.response.use(logInterceptor, errorInterceptor);

  return axiosInstance;
};

const axiosInstanceWithCache = axiosInstanceFactory();

/**
 * Default axios client - not cached by default
 * @param config
 * @returns
 */
const httpClient = async (config: CacheRequestConfig): Promise<any> =>
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
