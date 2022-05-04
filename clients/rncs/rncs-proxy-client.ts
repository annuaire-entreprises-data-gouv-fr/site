import { AxiosRequestConfig } from 'axios';
import httpClient, { httpGet } from '../../utils/network';

const APIRncsProxyClient = async (options: AxiosRequestConfig) =>
  await httpClient({
    method: 'GET', // default method
    ...options,
    headers: {
      'X-APIkey': process.env.PROXY_API_KEY || '',
      ...options?.headers,
    },
  });

export default APIRncsProxyClient;
