import { HttpUnauthorizedError } from '#clients/exceptions';
import constants from '#models/constants';
import { Information } from '#models/exceptions';
import { httpGet } from '#utils/network';
import { randomId } from '#utils/helpers';
import { logInfoInSentry } from '#utils/sentry';
import getSession from '#utils/server-side-helper/app/get-session';

const logUserRequest = async (route: string) => {
  const url = new URL(route)

  const [resource_type, resource_id] = (url.pathname.match(/\/(.*)\/([^\/]*)$/) || [null, null, null]).slice(1)

  let log = {
    date: (new Date()).toISOString(),
    timestamp: Date.now(),

    request: {
      route: route,
      id: randomId(),
    },

    content: {
      resource_type: resource_type,
      resource_id: resource_id,
    },

    // Elastic Common Schema : https://www.elastic.co/guide/en/ecs/current/ecs-url.html
    url: {
      scheme: (url.protocol.match(/^(https?)/) || ['']).shift(),
      domain: url.host,
      path: url.pathname,
      query: url.search,

    },
  }

  const session = await getSession()

  if (session.user) {
    // Elastic Common Schema : https://www.elastic.co/guide/en/ecs/current/ecs-user.html
    log.user = {
      email: session.user.email,
      siret: session.user.siret,
    };

  }

  console.log(`${JSON.stringify({'message': JSON.stringify(log)})}`)
}

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
  logUserRequest(route)

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
