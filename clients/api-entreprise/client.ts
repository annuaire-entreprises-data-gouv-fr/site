import { HttpUnauthorizedError } from '#clients/exceptions';
import constants from '#models/constants';
import { Information } from '#models/exceptions';
import { httpGet } from '#utils/network';
import { sensitiveRequestLogger } from '#utils/network/utils/sensitive-request-logger';
import { logInfoInSentry } from '#utils/sentry';

/**
 * Wrapper client to call API Entreprise
 *
 * @param route
 * @param mapToDomainObject
 * @param recipientSiret
 * @returns
 */
export default async function clientAPIEntreprise<T, U>(
  route: string,
  mapToDomainObject: (e: T) => U,
  recipientSiret?: string
) {
  if (!recipientSiret) {
    logInfoInSentry(
      new Information({
        name: 'NoRecipientSiretForAgent',
        message: 'Fallback on Dinum siret as recipient',
      })
    );
  }

  if (!process.env.API_ENTREPRISE_URL || !process.env.API_ENTREPRISE_TOKEN) {
    throw new HttpUnauthorizedError('Missing API Entreprise credentials');
  }

  sensitiveRequestLogger(route);

  // never cache any API Entreprise request
  const useCache = false;

  const response = await httpGet<T>(route, {
    headers: {
      Authorization: `Bearer ${process.env.API_ENTREPRISE_TOKEN}`,
    },
    timeout: constants.timeout.XXXL,
    params: {
      object: 'espace-agent-public',
      context: 'annuaire-entreprises',
      recipient: recipientSiret || '13002526500013',
    },
    useCache,
  });
  return mapToDomainObject(response);
}
