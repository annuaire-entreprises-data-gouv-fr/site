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
  const { config, response } = error;

  if (!response) {
    throw new HttpServerError(
      500,
      `Unknown server error while querying ${config.url}`
    );
  }

  switch (response.status) {
    case 429: {
      throw new HttpTooManyRequests(429, response.statusText);
    }
    case 404: {
      throw new HttpNotFound(404, response.statusText);
    }
    case 403: {
      throw new HttpForbiddenError(403, response.statusText);
    }
    case 504: {
      throw new HttpTimeoutError(504, response.statusText);
    }
    default:
      throw new HttpServerError(response.status, response.statusText);
  }
};

export const httpClientOAuthFactory = (
  token_url: string,
  client_id: string,
  client_secret: string
) => {
  if (!client_id || !client_secret) {
    throw new HttpServerError(500, 'Client id or client secret is undefined');
  }

  const getClientCredentials = oauth.client(axios.create(), {
    url: token_url,
    grant_type: 'client_credentials',
    client_id,
    client_secret,
    // scope: 'am_application_scope default',
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
