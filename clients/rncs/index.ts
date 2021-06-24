import { fetchRncsImmatriculation } from './immatriculation';
import routes from '../routes';
import { HttpAuthentificationFailure } from '../exceptions';
import httpClient from '../../utils/network/http';

/** Authenticate a user on opendata-rncs */
const rncsAuth = async () => {
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

export { fetchRncsImmatriculation, rncsAuth };
