import { fetchRncsImmatriculation } from './immatriculation';

import routes from '../routes';

export class RncsHttpServerError extends Error {
  constructor(public status: number, public message: string) {
    super();
  }
}

const rncsAuth = async () => {
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
    return undefined;
  }
  return cookie.split(';')[0];
};

export { fetchRncsImmatriculation, rncsAuth };
