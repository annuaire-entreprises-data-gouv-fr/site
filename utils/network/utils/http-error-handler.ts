import {
  AgentOverRateLimit,
  HttpBadRequestError,
  HttpConflict,
  HttpConnectionReset,
  HttpForbiddenError,
  HttpNotFound,
  HttpServerError,
  HttpTimeoutError,
  HttpTooManyRequests,
  HttpUnauthorizedError,
  HttpUnprocessableEntity,
} from '#clients/exceptions';

export const httpErrorHandler = (
  url: string,
  status: number,
  statusText: string | undefined,
  message: string
) => {
  switch (status) {
    case 432: {
      throw new AgentOverRateLimit(statusText || 'Agent over rate limit');
    }
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
      throw new HttpBadRequestError(message || 'Bad Request');
    }
    case 401: {
      throw new HttpUnauthorizedError('Unauthorized');
    }
    case 408: {
      throw new HttpTimeoutError('Timeout');
    }
    case 409: {
      throw new HttpConflict('Conflict');
    }
    case 422: {
      throw new HttpUnprocessableEntity(message || 'Unprocessable Entity');
    }
    case 504: {
      throw new HttpTimeoutError('Timeout');
    }
    default:
      if ((message || '').indexOf('ECONNRESET') > -1) {
        throw new HttpConnectionReset(
          `ECONNRESET  while querying ${url}. ${statusText || ''} ${
            message || ''
          }`
        );
      }
      throw new HttpServerError(
        `Unknown server error while querying ${url}. ${statusText || ''} ${
          message || ''
        }`
      );
  }
};
