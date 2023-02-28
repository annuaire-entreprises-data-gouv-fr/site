import { AxiosError } from 'axios';
import {
  HttpForbiddenError,
  HttpNotFound,
  HttpServerError,
  HttpTimeoutError,
  HttpTooManyRequests,
  HttpUnauthorizedError,
  HttpBadRequestError,
} from '#clients/exceptions';
import logErrorInSentry from '#utils/sentry';
import { formatLog } from './format-log';

const errorInterceptor = (error: AxiosError) => {
  const { config, response, message } = error || {};

  const url = config?.url || 'an unknown url';
  const status = response?.status;
  const statusText = response?.statusText;

  if (status !== 404) {
    const endTime = new Date().getTime();
    //@ts-ignore
    const startTime = config?.metadata?.startTime;
    console.error(
      formatLog(
        url,
        status || 500,
        false,
        startTime ? endTime - startTime : undefined
      )
    );
  }

  if (!response) {
    if (message) {
      if (message.indexOf('timeout of') > -1) {
        throw new HttpTimeoutError(`${message} while querying ${url}`);
      } else {
        throw new HttpServerError(message);
      }
    } else {
      throw new HttpServerError(`Unknown server error while querying ${url}.`);
    }
  }

  switch (response?.status) {
    case 429: {
      throw new HttpTooManyRequests(statusText || 'Too many requests');
    }
    case 404: {
      throw new HttpNotFound(statusText || 'Not Found');
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
        `Unknown server error while querying ${url}. ${statusText} ${message}`
      );
  }
};

export default errorInterceptor;
