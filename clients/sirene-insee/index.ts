import { httpClientOAuthFactory } from '../../utils/network/http';
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

const inseeClientFactory = (credentials = INSEE_CREDENTIALS.DEFAULT) => {
  const { client_id, client_secret } = getCredentials(credentials);

  return httpClientOAuthFactory(
    routes.sireneInsee.auth,
    client_id,
    client_secret
  );
};

const defaultInseeClient = inseeClientFactory(INSEE_CREDENTIALS.DEFAULT);
const fallBackInseeClient = inseeClientFactory(INSEE_CREDENTIALS.FALLBACK);

const inseeClient = (credentials = INSEE_CREDENTIALS.DEFAULT) =>
  credentials === INSEE_CREDENTIALS.DEFAULT
    ? defaultInseeClient
    : fallBackInseeClient;

export const inseeClientWrapper = async (
  url: string,
  method: 'GET' | 'POST',
  options?: RequestInit,
  credentials?: INSEE_CREDENTIALS
) => {
  const response = await inseeClient(credentials)({
    ...options,
    url,
    method,
  });
  return response.data;
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
