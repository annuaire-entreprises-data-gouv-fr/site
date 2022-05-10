import { AxiosRequestConfig } from 'axios';
import {
  defaultCacheConfig,
  httpClientOAuthFactory,
} from '../../utils/network';
import routes from '../routes';

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

export enum INSEE_CREDENTIALS {
  DEFAULT,
  FALLBACK,
}

export interface InseeClientOptions {
  useFallback: boolean;
  useCache: boolean;
}

/**
 * Can choose between two different set of credentials in case first is rate limited
 * */
const getCredentials = (credentials: INSEE_CREDENTIALS) => {
  if (credentials === INSEE_CREDENTIALS.FALLBACK) {
    return {
      client_id: process.env.INSEE_CLIENT_ID_FALLBACK,
      client_secret: process.env.INSEE_CLIENT_SECRET_FALLBACK,
    };
  }
  return {
    client_id: process.env.INSEE_CLIENT_ID,
    client_secret: process.env.INSEE_CLIENT_SECRET,
  };
};

export const inseeClientWrapper = async (
  url: string,
  method: 'GET' | 'POST',
  clientOptions: InseeClientOptions,
  requestOptions?: AxiosRequestConfig
) => {
  const { useFallback, useCache } = clientOptions;

  const credentials = useFallback
    ? INSEE_CREDENTIALS.FALLBACK
    : INSEE_CREDENTIALS.DEFAULT;

  const { client_id, client_secret } = getCredentials(credentials);

  // il faut tester qu'on s'authentifie pas a chaque fois !!!!
  const response = await httpClientOAuthFactory(
    routes.sireneInsee.auth,
    client_id,
    client_secret
  )({
    ...requestOptions,
    url,
    method,
    cache: useCache ? defaultCacheConfig : false,
  });
  return response.data;
};

export const inseeClientGet = async (
  route: string,
  options = { useFallback: false, useCache: false } as InseeClientOptions
) => inseeClientWrapper(route, 'GET', options, {});
