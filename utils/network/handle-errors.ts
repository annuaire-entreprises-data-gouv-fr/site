import { AxiosError } from 'axios';
import {
  HttpForbiddenError,
  HttpNotFound,
  HttpServerError,
  HttpTimeoutError,
  HttpTooManyRequests,
  HttpUnauthorizedError,
} from '../../clients/exceptions';

const handleError = (error: AxiosError) => {
  const { config, response, message } = error;

  if (!response) {
    if (message) {
      if (message.indexOf('timeout of') > -1) {
        throw new HttpTimeoutError(
          504,
          `${message} while querying ${config.url}`
        );
      } else {
        throw new HttpServerError(500, message);
      }
    } else {
      throw new HttpServerError(
        500,
        `Unknown server error while querying ${config.url}.`
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
    case 401: {
      throw new HttpUnauthorizedError(401, 'Unauthorized');
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

export default handleError;
