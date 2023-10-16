import { AxiosRequestConfig } from 'axios';
import { CacheRequestConfig } from 'axios-cache-interceptor';

export async function httpClient<T>(config: CacheRequestConfig): Promise<T> {
  if (typeof window === 'undefined') {
    const { httpBackClient } = await import('./backend');
    return httpBackClient<T>(config);
  } else {
    const { httpFrontClient } = await import('./frontend');
    return httpFrontClient<T>(config);
  }
}

export async function httpGet<T>(
  url: string,
  config?: AxiosRequestConfig,
  useCache = false
): Promise<T> {
  if (typeof window === 'undefined') {
    const { httpGet } = await import('./backend');
    return await httpGet<T>(url, config, useCache);
  } else {
    const { httpGet } = await import('./frontend');
    return await httpGet<T>(url, config);
  }
}

export default httpClient;
