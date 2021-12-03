import axios from 'axios';
//@ts-ignore
import * as oauth from 'axios-oauth-client';
import * as tokenProvider from 'axios-token-interceptor';
import { HttpServerError } from '../../clients/exceptions';
import constants from '../../models/constants';
import handleError from './handle-errors';

export const httpClientOAuthFactory = (
  token_url: string,
  client_id: string | undefined,
  client_secret: string | undefined
) => {
  if ((!client_id || !client_secret) && process.env.NODE_ENV === 'production') {
    throw new HttpServerError(500, 'Client id or client secret is undefined');
  }

  const getClientCredentials = oauth.client(axios.create(), {
    url: token_url,
    grant_type: 'client_credentials',
    client_id,
    client_secret,
  });

  const axiosInstance = axios.create({ timeout: constants.defaultTimeout });
  axiosInstance.interceptors.request.use(
    oauth.interceptor(tokenProvider, getClientCredentials)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => handleError(error)
  );
  return axiosInstance;
};

export default httpClientOAuthFactory;
