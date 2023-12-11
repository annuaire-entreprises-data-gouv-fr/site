import { HttpTimeoutError } from '#clients/exceptions';
import constants from '#models/constants';
import { Exception, IExceptionContext } from '#models/exceptions';
import { InternalError } from '#models/index';
import logErrorInSentry from '#utils/sentry';
import { IDefaultRequestConfig } from '..';
import { httpErrorHandler } from '../utils/http-error-handler';

function buildUrl(url: string, params: any) {
  try {
    const serializedParams = new URLSearchParams(params).toString();
    const separator = url.indexOf('?') > 0 ? '&' : '?';
    return `${url}${separator}${serializedParams}`;
  } catch (e: any) {
    logErrorInSentry(
      new Exception({
        name: 'BuildURLWithParamsException',
        cause: e,
        context: {
          details: url,
        },
      })
    );
    return url;
  }
}

export async function httpFrontClient<T>(config: IDefaultRequestConfig) {
  if (!config.url) {
    throw new InternalError({ message: 'Url is required' });
  }
  if (
    config.responseType ||
    config.useCache ||
    config.method ||
    config.data ||
    config.headers
  ) {
    throw new InternalError({
      message: 'Feature not yet supported on frontend client',
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(new HttpTimeoutError('Timeout'));
  }, config.timeout || constants.timeout.XXXXL);

  try {
    const response = await fetch(buildUrl(config.url, config.params), {
      signal: controller.signal,
    });
    const isJson = response.headers
      .get('content-type')
      ?.includes('application/json');

    const data = await (isJson ? response.json() : response.text());

    if (!response.ok) {
      return httpErrorHandler(
        config.url,
        response.status,
        response.statusText,
        data.message
      );
    }

    return data as T;
  } catch (e) {
    const errorArgs = {
      context: { page: config.url, details: `method: ${config.method}` },
      cause: e,
    };

    if (e instanceof TypeError && pendingUnload) {
      // Chrome and firefox systematically throw a TypeError when aborting a fetch when the user is navigating away
      // We don't want this error to bubble though the app
      throw new RequestAbortedDuringUnloadException(errorArgs);
    }
    throw new FailToFetchError(errorArgs);
  } finally {
    clearTimeout(timeoutId);
  }
}

let pendingUnload = false;
if (typeof window !== 'undefined') {
  window.onbeforeunload = () => {
    pendingUnload = true;
  };
}

export class RequestAbortedDuringUnloadException extends Exception {
  constructor(args: { context: IExceptionContext; cause: any }) {
    super({
      name: 'RequestAbortedDuringUnloadException',
      message: 'Fetch request aborted because user is navigating away',
      ...args,
    });
  }
}

export class FailToFetchError extends Exception {
  constructor(args: { context: IExceptionContext; cause: any }) {
    super({
      name: 'FailToFetchError',
      message: 'Error while trying to fetch ressource from client',
      ...args,
    });
  }
}

export default httpFrontClient;
