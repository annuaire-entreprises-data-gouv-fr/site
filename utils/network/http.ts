import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import constants from '../../constants';

enum StatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
}

const handleError = (error: AxiosResponse) => {
  console.log(error);
  const { status } = error;

  switch (status) {
    case StatusCode.InternalServerError: {
      // Handle InternalServerError
      break;
    }
    case StatusCode.Forbidden: {
      // Handle Forbidden
      break;
    }
    case StatusCode.Unauthorized: {
      // Handle Unauthorized
      break;
    }
    case StatusCode.TooManyRequests: {
      // Handle TooManyRequests
      break;
    }
  }
};

// if (response.status === 429) {
//   throw new HttpTooManyRequests(429, `Too many requests in Insee`);
// }
// if (response.status === 404) {
//   throw new HttpNotFound(404, `Not found`);
// }

// if (response.status === 403) {
//   throw new InseeForbiddenError(403, `Forbidden (non diffusible)`);
// }

export const httpClient = (config: AxiosRequestConfig) => {
  return axios({ timeout: constants.defaultTimeout, ...config })
    .then((response) => response.data)
    .catch((error) => handleError(error));
};

export const httpGet = (url: string, config?: AxiosRequestConfig) =>
  httpClient({ ...config, url, method: 'GET' });

export default httpClient;
