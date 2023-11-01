import { HttpTimeoutError } from '#clients/exceptions';
import constants from '#models/constants';
import { IDefaultRequestConfig } from '..';
import { httpErrorHandler } from '../utils/http-error-handler';

function buildUrl(url: string, params: any) {
  try {
    const serializedParams = Object.keys(params)
      .map((k) => `${k}=${params[k]}`)
      .join('&');

    const separator = url.indexOf('?') > 0 ? '&' : '?';
    return `${url}${separator}${serializedParams}`;
  } catch (e) {
    return url;
  }
}

export async function httpFrontClient<T>(config: IDefaultRequestConfig) {
  if (!config.url) {
    throw new Error('Url is required');
  }
  if (config.useCache || config.method || config.data || config.headers) {
    throw new Error('Feature not yet supported on frontend');
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
  } finally {
    clearTimeout(timeoutId);
  }
}

export default httpFrontClient;
