import { fetchRNCSImmatriculation } from './IMRJustificatif';
import { fetchRNCSIMR } from './IMR';

import httpClient from '../../utils/network/http';
import {
  HttpAuthentificationFailure,
  HttpUnauthorizedError,
} from '../exceptions';
import routes from '../routes';
import { AxiosRequestConfig } from 'axios';

let COOKIE = '';

/** Authenticate a user on opendata-rncs */
const AuthenticateCookie = async () => {
  try {
    const login = process.env.INPI_LOGIN as string;
    const password = process.env.INPI_PASSWORD as string;

    const response = await httpClient({
      url: routes.rncs.api.login,
      method: 'POST',
      headers: {
        login: login,
        password: password,
      },
    });

    const cookie = response.headers['set-cookie'][0];
    if (!cookie || typeof cookie !== 'string') {
      throw new Error('Authentication failed');
    }
    COOKIE = cookie.split(';')[0];
  } catch (e) {
    throw new HttpAuthentificationFailure(e);
  }
};

const fetchData = async (route: string, options?: AxiosRequestConfig) => {
  return await httpClient({
    ...options,
    url: route,
    method: 'GET',
    headers: { Cookie: COOKIE },
    timeout: 12000, // INPI API can take a looong time
  });
};

const RNCSClientWrapper = async (
  route: string,
  options?: AxiosRequestConfig
) => {
  if (!COOKIE) {
    await AuthenticateCookie();
  }
  try {
    return await fetchData(route, options);
  } catch (e) {
    if (e instanceof HttpUnauthorizedError) {
      await AuthenticateCookie();
      return await fetchData(route, options);
    }
  }
};

export { fetchRNCSImmatriculation, fetchRNCSIMR, RNCSClientWrapper };
