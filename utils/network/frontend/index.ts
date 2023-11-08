import { HttpTimeoutError } from '#clients/exceptions';
import constants from '#models/constants';
import logErrorInSentry from '#utils/sentry';
import { IDefaultRequestConfig } from '..';
import { httpErrorHandler } from '../utils/http-error-handler';

function buildUrl(url: string, params: any) {
  try {
    const serializedParams = new URLSearchParams(params).toString();
    const separator = url.indexOf('?') > 0 ? '&' : '?';
    return `${url}${separator}${serializedParams}`;
  } catch (e) {
    logErrorInSentry(e, {
      errorName: 'Error while building url on frontend client',
      details: url,
    });
    return url;
  }
}

export async function httpFrontClient<T>(config: IDefaultRequestConfig) {
  if (!config.url) {
    throw new Error('Url is required');
  }
  if (config.useCache || config.method || config.data || config.headers) {
    throw new Error('Feature not yet supported on frontend client');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    throw new HttpTimeoutError('Timeout');
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
    if (e instanceof TypeError && pendingUnload) {
      // Chrome and firefox systematically throw a TypeError when aborting a fetch when the user is navigating away
      // We don't want this error to bubble though the app
      throw new RequestAbortedDuringUnloadException();
    }
    throw e;
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

export class RequestAbortedDuringUnloadException extends Error {
  name = 'RequestAbortedDuringUnload';
  constructor() {
    super('Fetch request aborted because user is navigating away');
  }
}

export default httpFrontClient;
