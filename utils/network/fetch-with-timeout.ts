import { HttpTimeoutError } from '../../clients/exceptions';
import AbortController from 'abort-controller';

/**
 * Wraps node-fecth and add timeout management
 * https://dmitripavlutin.com/timeout-fetch-request/
 * */
export async function fetchWithTimeout(
  resource: RequestInfo,
  options?: RequestInit,
  timeout = 10000
) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);

    return response;
  } catch (error) {
    throw new HttpTimeoutError(
      `TIMEOUT - ${resource.toString()} took longer than ${timeout} - ${error}`
    );
  }
}
