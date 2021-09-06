import { fetchRNCSImmatriculation } from './IMRJustificatif';
import { fetchRNCSIMR } from './IMR';

import httpClient from '../../utils/network/http';
import { HttpAuthentificationFailure } from '../exceptions';
import routes from '../routes';
import { AxiosRequestConfig } from 'axios';

/** Authenticate a user on opendata-rncs */
const RNCSAuth = async () => {
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
    return cookie.split(';')[0];
  } catch (e) {
    throw new HttpAuthentificationFailure(e);
  }
};

const RNCSClientWrapper = async (
  route: string,
  options?: AxiosRequestConfig
) => {
  const cookie = await RNCSAuth();
  const response = await httpClient({
    ...options,
    url: route,
    method: 'GET',
    headers: { Cookie: cookie },
    timeout: 12000, // INPI API can take a looong time
  });

  return response;
};

export { fetchRNCSImmatriculation, RNCSAuth, fetchRNCSIMR, RNCSClientWrapper };
