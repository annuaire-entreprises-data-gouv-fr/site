import { fetchRncsImmatriculation } from './immatriculation';

import routes from '../routes';

export class RncsHttpServerError extends Error {
  constructor(public status: number, public message: string) {
    super();
  }
}
export class RncsAuthError extends Error {
  constructor(public message: string) {
    super();
  }
}

const rncsAuth = async () => {
  try {
    const login = process.env.INPI_LOGIN as string;
    const password = process.env.INPI_PASSWORD as string;

    const response = await fetch(routes.rncs.api.login, {
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
    throw new RncsAuthError(e);
  }
};

export { fetchRncsImmatriculation, rncsAuth };
