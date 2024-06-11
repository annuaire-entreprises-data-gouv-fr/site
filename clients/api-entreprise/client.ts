import { HttpUnauthorizedError } from '#clients/exceptions';
import constants from '#models/constants';
import { Information } from '#models/exceptions';
import { httpGet } from '#utils/network';
import { sensitiveRequestCallerInfos } from '#utils/network/utils/sensitive-request-caller-infos';
import { sensitiveRequestLogger } from '#utils/network/utils/sensitive-request-logger';
import { logInfoInSentry } from '#utils/sentry';

export type IAPIEntrepriseResponse<T> = {
  data: T;
  links: {};
  meta: {};
};
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
  mapToDomainObject: (e: T) => U
) {
  const callerInfos = await sensitiveRequestCallerInfos();
  sensitiveRequestLogger(route, callerInfos);

  if (!callerInfos.siret) {
    logInfoInSentry(
      new Information({
        name: 'NoRecipientSiretForAgent',
        message: 'Fallback on Dinum siret',
        context: { domain: callerInfos.domain },
      })
    );
  }

  if (!process.env.API_ENTREPRISE_URL || !process.env.API_ENTREPRISE_TOKEN) {
    throw new HttpUnauthorizedError('Missing API Entreprise credentials');
  }

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
      recipient: callerInfos.siret || '13002526500013',
    },
    useCache,
  });
  return mapToDomainObject(response);
}
