import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  HttpForbiddenError,
  HttpNotFound,
  HttpServerError,
  HttpTimeoutError,
  HttpTooManyRequests,
} from '../../clients/exceptions';
import constants from '../../constants';

enum StatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
}

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
