import { fetchRNCSImmatriculation } from './IMRJustificatif';
import { fetchRNCSIMR } from './IMR';

import routes from '../routes';
import {
  HttpAuthentificationFailure,
  HttpNotFound,
  HttpTooManyRequests,
} from '../exceptions';
import { fetchWithTimeout } from '../../utils/network/fetch-with-timeout';

/** Authenticate a user on opendata-rncs */
const RNCSAuth = async () => {
  try {
    const login = process.env.INPI_LOGIN as string;
    const password = process.env.INPI_PASSWORD as string;

    const response = await fetchWithTimeout(routes.rncs.api.login, {
      method: 'POST',
      headers: {
        login: login,
        password: password,
      },
    });

    const cookie = response.headers.get('set-cookie');
    if (!cookie || typeof cookie !== 'string') {
      throw new Error('Authentication failed');
    }
    return cookie.split(';')[0];
  } catch (e) {
    throw new HttpAuthentificationFailure(e);
  }
};

const RNCSClientWrapper = async (route: string, options?: RequestInit) => {
  const cookie = await RNCSAuth();
  const response = await fetchWithTimeout(route, {
    ...options,
    headers: { Cookie: cookie },
  });

  if (response.status === 404) {
    throw new HttpNotFound(404, `Not found in RNCS`);
  }

  if (response.status === 429) {
    throw new HttpTooManyRequests(429, `Too many requests in RNCS`);
  }
  return response;
};

export { fetchRNCSImmatriculation, RNCSAuth, fetchRNCSIMR, RNCSClientWrapper };
