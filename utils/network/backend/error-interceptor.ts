import { AxiosError, AxiosResponse } from 'axios';
import { formatLog } from '../utils/format-log';
import { httpErrorHandler } from '../utils/http-error-handler';

const getStatus = (response?: AxiosResponse, message?: string) => {
  if (response?.status) {
    return response.status;
  }
  if ((message || '').indexOf('timeout of') > -1) {
    return 408;
  }
  return 500;
};

const errorInterceptor = (error: AxiosError) => {
  const { config, response, message } = error || {};

  const url = (config?.url || 'an unknown url').substring(0, 100);
  const status = getStatus(response, message);
  const statusText = response?.statusText;

  if (status !== 404) {
    const endTime = new Date().getTime();
    //@ts-ignore
    const startTime = config?.metadata?.startTime;
    console.error(
      formatLog(url, status, false, startTime ? endTime - startTime : undefined)
    );
  }
  httpErrorHandler(url, status, statusText, message);
};

export default errorInterceptor;
