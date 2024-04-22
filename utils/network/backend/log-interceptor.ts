import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { formatLog } from '../utils/format-log';

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
  const endTime = new Date().getTime();
  //@ts-ignore
  const startTime = response?.config?.metadata?.startTime;

  // logged into stdout
  // eslint-disable-next-line no-console
  console.info(
    formatLog(
      response?.config?.url || '',
      response?.status,
      //@ts-ignore
      response?.cached,
      startTime ? endTime - startTime : undefined,
      (response?.config?.method || '').toUpperCase()
    )
  );
  return response;
};
