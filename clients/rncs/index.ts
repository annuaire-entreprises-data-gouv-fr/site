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

const getCredentials = () => {
  const logins = [
    process.env.INPI_LOGIN,
    process.env.INPI_LOGIN_2,
    process.env.INPI_LOGIN_3,
    process.env.INPI_LOGIN_4,
  ];
  const passwords = [
    process.env.INPI_PASSWORD,
    process.env.INPI_PASSWORD_2,
    process.env.INPI_PASSWORD_3,
    process.env.INPI_PASSWORD_4,
  ];

  const index = Math.floor(Math.random() * 3);
  return { login: logins[index], password: passwords[index] };
};

/** Authenticate a user on opendata-rncs */
const AuthenticateCookie = async () => {
  try {
    const { login, password } = getCredentials();

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

    throw e;
  }
};

export { fetchRNCSImmatriculation, fetchRNCSIMR, RNCSClientWrapper };
