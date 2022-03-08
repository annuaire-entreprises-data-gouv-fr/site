import httpClient from '../../utils/network';
import {
  HttpAuthentificationFailure,
  HttpUnauthorizedError,
} from '../exceptions';
import routes from '../routes';
import { AxiosRequestConfig } from 'axios';

let COOKIE = [] as string[];

const credentials = [
  [process.env.INPI_LOGIN, process.env.INPI_PASSWORD],
  [process.env.INPI_LOGIN_2, process.env.INPI_PASSWORD_2],
  [process.env.INPI_LOGIN_3, process.env.INPI_PASSWORD_3],
  // [process.env.INPI_LOGIN_4, process.env.INPI_PASSWORD_4],
  [process.env.INPI_LOGIN_5, process.env.INPI_PASSWORD_5],
  [process.env.INPI_LOGIN_6, process.env.INPI_PASSWORD_6],
];

const getCredentials = (index: number) => {
  const credential = credentials[index];
  return { login: credential[0] || '', password: credential[1] || '' };
};

/** Authenticate a user on opendata-rncs */
const createAndAuthenticateCookie = async (index: number) => {
  try {
    const { login, password } = getCredentials(index);

    const response = await httpClient({
      url: routes.rncs.api.login,
      method: 'POST',
      headers: {
        login: login,
        password: password,
      },
    });

    const setCookieValue = response.headers['set-cookie'] || [];
    const cookie = setCookieValue[0];

    if (!cookie || typeof cookie !== 'string') {
      throw new Error('Authentication failed');
    }
    COOKIE[index] = cookie.split(';')[0];
  } catch (e: any) {
    throw new HttpAuthentificationFailure(e);
  }
};

const fetchData = async (
  route: string,
  cookie: string,
  options?: AxiosRequestConfig
) => {
  return await httpClient({
    ...options,
    url: route,
    method: 'GET',
    headers: { Cookie: cookie },
    timeout: 1500, // we know INPI API fails frequently so lets have it fail fast
  });
};

const RNCSClientWrapper = async (
  route: string,
  options?: AxiosRequestConfig
) => {
  const index = Math.floor(Math.random() * credentials.length);
  try {
    if (!COOKIE[index]) {
      await createAndAuthenticateCookie(index);
    }
    return await fetchData(route, COOKIE[index], options);
  } catch (e: any) {
    if (e instanceof HttpUnauthorizedError) {
      await createAndAuthenticateCookie(index);
      return await fetchData(route, COOKIE[index], options);
    }

    throw e;
  }
};

export { RNCSClientWrapper };
