import { AxiosRequestConfig } from 'axios';
import oauth from 'axios-oauth-client';
import tokenProvider from 'axios-token-interceptor';
import { HttpServerError } from '#clients/exceptions';
import constants from '#models/constants';
import {
  defaultAxiosInstanceFactory,
  cachedAxiosInstanceFactory,
  defaultCacheConfig,
} from '.';

export const httpClientOAuthGetFactory = (
  token_url: string,
  client_id: string | undefined,
  client_secret: string | undefined
) => {
  if ((!client_id || !client_secret) && process.env.NODE_ENV === 'production') {
    throw new HttpServerError('Client id or client secret is undefined');
  }

  // function that get oauth2 token
  const getAuthorizationCode = oauth.clientCredentials(
    defaultAxiosInstanceFactory(constants.timeout.XS),
    token_url,
    client_id,
    client_secret
  );

  const cachedAxiosInstance = cachedAxiosInstanceFactory();

  // memory cache to avoid getting token from insee at every call
  // when it reaches max-age, it gets refresh
  const cache = tokenProvider.tokenCache(
    () =>
      getAuthorizationCode('OPTIONAL_SCOPES').then((response: any) => {
        return response;
      }),
    {
      getMaxAge: (res: any) => {
        return res.expires_in * 1000;
      },
    }
  );

  // interceptor that retrieve token from cache at every used of cachedAxiosInstance
  cachedAxiosInstance.interceptors.request.use(
    //@ts-ignore
    tokenProvider({
      getToken: cache,
      headerFormatter: (body: any) => {
        return `Bearer ${body.access_token}`;
      },
    })
  );

  return async (url: string, options: AxiosRequestConfig, useCache: boolean) =>
    cachedAxiosInstance.get(url, {
      timeout: constants.timeout.M,
      ...options,
      cache: useCache ? defaultCacheConfig : false,
    });
};

export default httpClientOAuthGetFactory;
