/**
 * API SIRENE by INSEE
 *
 * This route calls the official INSEE API, that has several limitations :
 * instable + not many concurrent request allowed.
 *
 * The idea is to only call it when the Etalab SIRENE does not answer :
 * - API Etalab is down
 * - requested company is non-diffusible
 * - requested company is very recent and API Etalab is not yet up to dat
 * - requested company does not exist
 *
 * IN all three first cases, API SIRENE by INSEE can answer, and we map the answer to the UniteLegale type
 *
 */

import { fetchWithTimeout } from '../../utils/network/fetch-with-timeout';
import {
  HttpAuthentificationFailure,
  HttpNotFound,
  HttpTooManyRequests,
} from '../exceptions';
import routes from '../routes';

export class InseeForbiddenError extends Error {
  constructor(public status: number, public message: string) {
    super();
  }
}

export const inseeAuth = async () => {
  try {
    const clientId = process.env.INSEE_CLIENT_ID;
    const clientSecret = process.env.INSEE_CLIENT_SECRET;
    const response = await fetchWithTimeout(routes.sireneInsee.auth, {
      method: 'POST',
      body:
        'grant_type=client_credentials&client_id=' +
        clientId +
        '&client_secret=' +
        clientSecret,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const rawResponse = await response.text();
    try {
      const token = JSON.parse(rawResponse);
      if (!token) {
        throw new Error(`No token`);
      }
      return token;
    } catch (e) {
      // when on maintenance mode, INSEE will return a html error page with a 200 :/
      throw new Error(rawResponse);
    }
  } catch (e) {
    throw new HttpAuthentificationFailure(e);
  }
};

export const inseeClientGet = async (route: string) => {
  const token = await inseeAuth();

  const response = await fetchWithTimeout(route, {
    headers: {
      Authorization: token.token_type + ' ' + token.access_token,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (response.status === 429) {
    throw new HttpTooManyRequests(429, `Too many requests`);
  }
  if (response.status === 404) {
    throw new HttpNotFound(404, `Too many requests`);
  }

  if (response.status === 403) {
    throw new InseeForbiddenError(403, `Forbidden`);
  }

  return response;
};

export const inseeClientPost = async (route: string, body: string) => {
  const token = await inseeAuth();

  const response = await fetchWithTimeout(route, {
    headers: {
      Authorization: token.token_type + ' ' + token.access_token,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    body,
  });

  if (response.status === 429) {
    throw new HttpTooManyRequests(429, `Too many requests`);
  }
  if (response.status === 404) {
    throw new HttpNotFound(404, `Too many requests`);
  }

  if (response.status === 403) {
    throw new InseeForbiddenError(403, `Forbidden`);
  }

  return response;
};
