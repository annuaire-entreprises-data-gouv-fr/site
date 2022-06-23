import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CacheAxiosResponse } from 'axios-cache-interceptor';
import { formatLog } from './format-log';

/**
 * Add startTime to request
 * @param config
 */
export const addStartTimeInterceptor = (config: AxiosRequestConfig) => {
  return {
    ...config,
    metadata: { startTime: new Date().getTime() },
  };
};

/**
 * Log into STDOUT in production
 * @param response
 */
export const logInterceptor = (response: AxiosResponse<any, any>) => {
  if (process.env.NODE_ENV === 'production') {
    const endTime = new Date().getTime();
    //@ts-ignore
    const startTime = response?.config?.metadata?.startTime;

    // logged into stdout
    console.log(
      formatLog(
        response?.config?.url || '',
        response?.status,
        //@ts-ignore
        response?.cached,
        startTime ? endTime - startTime : undefined
      )
    );
  }
  return response;
};
