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

import routes from '../routes';

export class InseeAuthError extends Error {
  constructor(public message: string) {
    super();
  }
}
export class InseeTooManyRequestsError extends Error {
  constructor(public status: number, public message: string) {
    super();
  }
}
export class InseeForbiddenError extends Error {
  constructor(public status: number, public message: string) {
    super();
  }
}

export const inseeAuth = async () => {
  try {
    const clientId = process.env.INSEE_CLIENT_ID;
    const clientSecret = process.env.INSEE_CLIENT_SECRET;
    const response = await fetch(routes.sireneInsee.auth, {
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
    const token = response.json();
    if (!token) {
      throw new Error('Authentication failed');
    }
    return token;
  } catch (e) {
    throw new InseeAuthError(e);
  }
};

export const inseeClient = async (route: string) => {
  const token = await inseeAuth();

  const response = await fetch(route, {
    headers: {
      Authorization: token.token_type + ' ' + token.access_token,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (response.status === 429) {
    throw new InseeTooManyRequestsError(429, `Too many requests`);
  }

  if (response.status === 403) {
    throw new InseeForbiddenError(403, `Forbidden`);
  }

  return response;
};
