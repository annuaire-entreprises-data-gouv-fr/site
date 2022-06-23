import { AxiosError } from 'axios';
import {
  HttpForbiddenError,
  HttpNotFound,
  HttpServerError,
  HttpTimeoutError,
  HttpTooManyRequests,
  HttpUnauthorizedError,
  HttpBadRequestError,
} from '../../clients/exceptions';
import { formatLog } from './format-log';

const errorInterceptor = (error: AxiosError) => {
  const { config, response, message } = error;

  if (response?.status !== 404) {
    const endTime = new Date().getTime();
    //@ts-ignore
    const startTime = config?.metadata?.startTime;
    console.error(
      formatLog(
        config.url || '',
        response?.status || 500,
        false,
        startTime ? endTime - startTime : undefined
      )
    );
  }

  if (!response) {
    if (message) {
      if (message.indexOf('timeout of') > -1) {
        throw new HttpTimeoutError(`${message} while querying ${config.url}`);
      } else {
        throw new HttpServerError(message);
      }
    } else {
      throw new HttpServerError(
        `Unknown server error while querying ${config.url}.`
      );
    }
  }

  switch (response.status) {
    case 429: {
      throw new HttpTooManyRequests(response.statusText || 'Too many requests');
    }
    case 404: {
      throw new HttpNotFound(response.statusText || 'Not Found');
    }
    case 403: {
      throw new HttpForbiddenError('Forbidden');
    }
    case 400: {
      throw new HttpBadRequestError('Bad Request');
    }
    case 401: {
      throw new HttpUnauthorizedError('Unauthorized');
    }
    case 504: {
      throw new HttpTimeoutError('Timeout');
    }
    default:
      throw new HttpServerError(
        `Unknown server error while querying ${config.url}. ${response.statusText} ${message}`
      );
  }
};

export default errorInterceptor;
