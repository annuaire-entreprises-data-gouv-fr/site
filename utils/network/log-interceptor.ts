import { AxiosResponse } from 'axios';

/**
 * Log into STDOUT in production
 * @param response
 */
const logInterceptor = (response: AxiosResponse<any, any>) => {
  if (true || process.env.NODE_ENV === 'production') {
    //@ts-ignore
    const cached = response?.cached || false;
    const log = `status=${response?.status} isFromCached=${cached} request=${response?.config?.url}`;
    console.log(log);
  }
  return response;
};

export default logInterceptor;
