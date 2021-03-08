import { rncsAuth } from '.';
import {
  HttpNotFound,
  HttpServerError,
  HttpTooManyRequests,
} from '../exceptions';
import routes from '../routes';

export const fetchRncsImmatriculation = async (siren: string) => {
  const cookie = await rncsAuth();
  if (!cookie) {
    return null;
  }

  const response = await fetch(routes.rncs.api.imr + siren, {
    headers: { Cookie: cookie },
  });

  if (response.status === 404) {
    throw new HttpNotFound(404, `Siren ${siren} not found in RNM`);
  }

  if (response.status === 500) {
    throw new HttpServerError(
      500,
      `Siren ${siren} triggered a server error in RNCS`
    );
  }

  if (response.status === 429) {
    throw new HttpTooManyRequests(429, `Too many requests in RNCS`);
  }

  return await response.json();
};
