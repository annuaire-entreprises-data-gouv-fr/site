import http from 'http';
import https from 'https';
import Axios from 'axios';
import {
  AxiosCacheInstance,
  CacheRequestConfig,
  setupCache,
} from 'axios-cache-interceptor';
import constants from '#models/constants';
import { CACHE_TIMEOUT } from '../utils/cache-config';
import errorInterceptor from './error-interceptor';
import { addStartTimeInterceptor, logInterceptor } from './log-interceptor';
import redisStorage, { connect } from './redis/redis-storage';

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
 * Returns a cache-enabled axios instance
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

async function httpBackClient<T>(config: CacheRequestConfig): Promise<T> {
  await connect();
  const response = await axiosInstanceWithCache({
    timeout: constants.timeout.L,
    cache: false,
    ...config,
  });
  return response.data;
}

export { httpBackClient };

export default httpBackClient;
