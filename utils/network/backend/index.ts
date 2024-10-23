import constants from '#models/constants';
import Axios, { AxiosInstance } from 'axios';
import http from 'http';
import https from 'https';
import { IDefaultRequestConfig } from '..';
import errorInterceptor from './error-interceptor';
import { addStartTimeInterceptor, logInterceptor } from './log-interceptor';

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
const axiosInstanceFactory = (timeout = constants.timeout.L): AxiosInstance => {
  const axiosOptions = {
    timeout,
    httpsAgent: new https.Agent(agentOptions),
    httpAgent: new http.Agent(agentOptions),
  };

  const axiosInstance = Axios.create(axiosOptions);

  //@ts-ignore
  axiosInstance.interceptors.request.use(addStartTimeInterceptor, (err) =>
    Promise.reject(err)
  );

  //@ts-ignore
  axiosInstance.interceptors.response.use(logInterceptor, errorInterceptor);

  return axiosInstance;
};

const axiosInstance = axiosInstanceFactory();

async function httpBackClient<T>(config: IDefaultRequestConfig): Promise<T> {
  const response = await axiosInstance({
    timeout: constants.timeout.L,
    ...config,
    headers: {
      'User-Agent': 'annuaire-entreprises-site',
      ...(config.headers || {}),
    },
  });
  return response.data;
}

export { httpBackClient };

export default httpBackClient;
