import axios from 'axios';
//@ts-ignore
import * as oauth from 'axios-oauth-client';
import * as tokenProvider from 'axios-token-interceptor';
import { HttpServerError } from '../../clients/exceptions';
import constants from '../../models/constants';
import logInterceptor from './log-interceptor';
import errorInterceptor from './error-interceptor';
import { setupCache } from 'axios-cache-interceptor';
import redisStorage from './redis-storage';

export const httpClientOAuthFactory = (
  token_url: string,
  client_id: string | undefined,
  client_secret: string | undefined
) => {
  if ((!client_id || !client_secret) && process.env.NODE_ENV === 'production') {
    throw new HttpServerError('Client id or client secret is undefined');
  }

  // use a different login instance - we dont want to cache login route
  const axiosLoginInstance = axios.create();
  axiosLoginInstance.interceptors.response.use(
    logInterceptor,
    errorInterceptor
  );

  const getClientCredentials = oauth.client(axiosLoginInstance, {
    url: token_url,
    grant_type: 'client_credentials',
    client_id,
    client_secret,
    timeout: constants.timeout.default,
  });

  const axiosInstance = setupCache(axios.create(), {
    storage: redisStorage,
    debug: console.log,
  });

  axiosInstance.interceptors.request.use(
    oauth.interceptor(tokenProvider, getClientCredentials)
  );
  axiosInstance.interceptors.response.use(logInterceptor, errorInterceptor);
  return axiosInstance;
};

export default httpClientOAuthFactory;
