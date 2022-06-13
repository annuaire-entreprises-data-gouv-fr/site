import { AxiosResponse } from 'axios';
import { formatLog } from './format-log';

/**
 * Log into STDOUT in production
 * @param response
 */
const logInterceptor = (response: AxiosResponse<any, any>) => {
  if (true || process.env.NODE_ENV === 'production') {
    // logged into stdout
    console.log(
      formatLog(
        response?.config?.url || '',
        response?.status,
        //@ts-ignore
        response?.cached || false
      )
    );
  }
  return response;
};

export default logInterceptor;
