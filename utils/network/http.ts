import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
//@ts-ignore
import * as oauth from 'axios-oauth-client';
import * as tokenProvider from 'axios-token-interceptor';

import {
  HttpForbiddenError,
  HttpNotFound,
  HttpServerError,
  HttpTimeoutError,
  HttpTooManyRequests,
} from '../../clients/exceptions';
import constants from '../../constants';

const handleError = (error: AxiosError) => {
  const { config, response, message } = error;

  if (!response) {
    if (message && message.indexOf('timeout of') > -1) {
      throw new HttpTimeoutError(
        504,
        `${message} while querying ${config.url}`
      );
    } else {
      throw new HttpServerError(
        500,
        `Unknown server error while querying ${config.url}. ${message}`
      );
    }
  }

  switch (response.status) {
    case 429: {
      throw new HttpTooManyRequests(
        429,
        response.statusText || 'Too many requests'
      );
    }
    case 404: {
      throw new HttpNotFound(404, response.statusText || 'Not Found');
    }
    case 403: {
      throw new HttpForbiddenError(403, 'Forbidden');
    }
    case 504: {
      throw new HttpTimeoutError(504, 'Timeout');
    }
    default:
      throw new HttpServerError(
        response.status,
        `Unknown server error while querying ${config.url}. ${response.statusText} ${message}`
      );
  }
};

export const httpClientOAuthFactory = (
  token_url: string,
  client_id: string | undefined,
  client_secret: string | undefined
) => {
  if (!client_id || !client_secret) {
    throw new HttpServerError(500, 'Client id or client secret is undefined');
  }

  const getClientCredentials = oauth.client(axios.create(), {
    url: token_url,
    grant_type: 'client_credentials',
    client_id,
    client_secret,
  });

  const axiosInstance = axios.create({ timeout: constants.defaultTimeout });
  axiosInstance.interceptors.request.use(
    oauth.interceptor(tokenProvider, getClientCredentials)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => handleError(error)
  );
  return axiosInstance;
};

export const httpClient = (
  config: AxiosRequestConfig
): Promise<AxiosResponse> => {
  return axios({ timeout: constants.defaultTimeout, ...config })
    .then((response) => response)
    .catch((error) => handleError(error));
};

export const httpGet = (url: string, config?: AxiosRequestConfig) =>
  httpClient({ ...config, url, method: 'GET' });

export default httpClient;
