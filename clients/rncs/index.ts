import { fetchRncsImmatriculation } from './immatriculation';

import routes from '../routes';
import { HttpAuthentificationFailure } from '../exceptions';
import { fetchWithTimeout } from '../../utils/network/fetch-with-timeout';

/** Authenticate a user on opendata-rncs */
const rncsAuth = async () => {
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

export { fetchRncsImmatriculation, rncsAuth };
