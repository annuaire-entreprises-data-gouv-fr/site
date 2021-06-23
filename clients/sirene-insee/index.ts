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

import axios, { Method } from 'axios';
import constants from '../../constants';
import httpClient, { httpGet } from '../../utils/network/http';
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

export enum INSEE_CREDENTIALS {
  DEFAULT,
  FALLBACK,
}

/**
 * Can choose between two different set of credentials in case first is rate limited
 * */
const getCredentials = (credentials: INSEE_CREDENTIALS) => {
  if (credentials === INSEE_CREDENTIALS.FALLBACK) {
    return {
      clientId: process.env.INSEE_CLIENT_ID_FALLBACK,
      clientSecret: process.env.INSEE_CLIENT_SECRET_FALLBACK,
    };
  }
  return {
    clientId: process.env.INSEE_CLIENT_ID,
    clientSecret: process.env.INSEE_CLIENT_SECRET,
  };
};

/**
 * Calls insee authent route
 * @param useFallbackToken
 * @returns
 */
const inseeAuth = async (credentials = INSEE_CREDENTIALS.DEFAULT) => {
  try {
    const { clientId, clientSecret } = getCredentials(credentials);
    const response = await httpGet(routes.sireneInsee.auth, {
      method: 'POST',
      data:
        'grant_type=client_credentials&client_id=' +
        clientId +
        '&client_secret=' +
        clientSecret,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    try {
      const token = JSON.parse(response);
      if (!token) {
        throw new Error(`No token`);
      }
      return token;
    } catch (e) {
      // when on maintenance mode, INSEE will return a html error page with a 200 :/
      throw new Error(response);
    }
  } catch (e) {
    throw new HttpAuthentificationFailure(e);
  }
};

export const inseeClientWrapper = async (
  url: string,
  method: Method,
  options?: RequestInit,
  credentials?: INSEE_CREDENTIALS
) => {
  const token = await inseeAuth(credentials);

  const response = await httpClient({
    ...options,
    url,
    method,
    headers: {
      Authorization: token.token_type + ' ' + token.access_token,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response;
};

export const inseeClientGet = async (
  route: string,
  credentials?: INSEE_CREDENTIALS
) => inseeClientWrapper(route, 'GET', {}, credentials);

export const inseeClientPost = async (
  route: string,
  body: string,
  credentials?: INSEE_CREDENTIALS
) =>
  inseeClientWrapper(
    route,
    'POST',
    {
      body,
    },
    credentials
  );
