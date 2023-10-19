import {
  HttpBadRequestError,
  HttpForbiddenError,
  HttpNotFound,
  HttpServerError,
  HttpTimeoutError,
  HttpTooManyRequests,
  HttpUnauthorizedError,
} from '#clients/exceptions';

export const httpErrorHandler = (
  url: string,
  status: number,
  statusText: string | undefined,
  message: string
) => {
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
