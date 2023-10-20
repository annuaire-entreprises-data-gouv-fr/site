import { HttpTimeoutError } from '#clients/exceptions';
import constants from '#models/constants';
import { IDefaultRequestConfig } from '..';
import { httpErrorHandler } from '../utils/http-error-handler';

export async function httpFrontClient<T>(config: IDefaultRequestConfig) {
  if (!config.url) {
    throw new Error('Url required');
  }
  if (
    config.params ||
    config.useCache ||
    config.method ||
    config.data ||
    config.headers
  ) {
    throw new Error('Feature not yet supported on frontend');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    throw new HttpTimeoutError('Timeout');
  }, config.timeout || constants.timeout.XXXXL);

  try {
    const response = await fetch(config.url, {
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
  } finally {
    clearTimeout(timeoutId);
  }
}

export default httpFrontClient;
