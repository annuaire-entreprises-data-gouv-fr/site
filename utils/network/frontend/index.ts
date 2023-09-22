import {
  HttpBadRequestError,
  HttpForbiddenError,
  HttpNotFound,
  HttpServerError,
  HttpTimeoutError,
  HttpTooManyRequests,
  HttpUnauthorizedError,
} from '#clients/exceptions';

async function httpFrontClient<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);

  if (!response.ok) {
    switch (response.status) {
      case 429: {
        throw new HttpTooManyRequests(
          response.statusText || 'Too many requests'
        );
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
      case 408: {
        throw new HttpTimeoutError('Timeout');
      }
      case 504: {
        throw new HttpTimeoutError('Timeout');
      }
      default:
        throw new HttpServerError(
          `Unknown server error while querying ${request}. ${
            response.statusText || ''
          }`
        );
    }
  }

  // may error if there is no body, return empty array
  return response.json().catch(() => ({}));
}

export default httpFrontClient;
