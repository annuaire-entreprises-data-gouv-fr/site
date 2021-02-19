import { RnmHttpServerError } from '.';
import { HttpNotFound } from '../exceptions';
import routes from '../routes';

export const fetchRnmImmatriculation = async (siren: string) => {
  const response = await fetch(routes.rnm + siren + '?format=json');

  if (response.status === 404) {
    throw new HttpNotFound(404, `Siren ${siren} not found in RNM`);
  }

  if (response.status === 500) {
    throw new RnmHttpServerError(
      500,
      `Siren ${siren} triggered a server error in RNM`
    );
  }

  return await response.json();
};
