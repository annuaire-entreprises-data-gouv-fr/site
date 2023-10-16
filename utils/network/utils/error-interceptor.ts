import { AxiosError, AxiosResponse } from 'axios';
import {
  HttpBadRequestError,
  HttpForbiddenError,
  HttpNotFound,
  HttpServerError,
  HttpTimeoutError,
  HttpTooManyRequests,
  HttpUnauthorizedError,
} from '#clients/exceptions';
import { formatLog } from './format-log';

const getStatus = (response?: AxiosResponse, message?: string) => {
  if (response?.status) {
    return response.status;
  }
  if ((message || '').indexOf('timeout of') > -1) {
    return 408;
  }
  return 500;
};

const errorInterceptor = (error: AxiosError) => {
  const { config, response, message } = error || {};

  const url = (config?.url || 'an unknown url').substring(0, 100);
  const status = getStatus(response, message);
  const statusText = response?.statusText;

  if (status !== 404) {
    const endTime = new Date().getTime();
    //@ts-ignore
    const startTime = config?.metadata?.startTime;
    console.error(
      formatLog(url, status, false, startTime ? endTime - startTime : undefined)
    );
  }

  switch (status) {
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
    case 408: {
      throw new HttpTimeoutError('Timeout');
    }
    case 504: {
      throw new HttpTimeoutError('Timeout');
    }
    default:
      throw new HttpServerError(
        `Unknown server error while querying ${url}. ${statusText || ''} ${
          message || ''
        }`
      );
  }
};

export default errorInterceptor;
