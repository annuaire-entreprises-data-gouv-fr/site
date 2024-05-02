import { Exception } from '#models/exceptions';
import { extractSirenOrSiretSlugFromUrl, randomId } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import getSession from '#utils/server-side-helper/app/get-session';

type ISensitiveLogType = {
  date: string;
  timestamp: number;
  request: {
    route: string;
    id: string;
  };
  content: {
    resource_type: string | null;
    resource_id: string | null;
  };
  url: {
    scheme: string;
    domain: string;
    path: string;
    query: string;
  };
  user?: {
    email?: string;
    siret?: string;
    scopes?: string[];
    domain?: string;
  };
};

/**
 * Dedicated logger for sensitive requests.
 *
 * Has to be called in addition to regular log
 *
 * @param route
 */
export const sensitiveRequestLogger = async (route: string) => {
  try {
    const url = new URL(route);

    const resource_type = url.pathname
      .replace(/\d{9}|\d{14}/, '')
      .replace('//', '/');

    const resource_id = extractSirenOrSiretSlugFromUrl(url.pathname);

    let log: ISensitiveLogType = {
      date: new Date().toISOString(),
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
        scheme: (url.protocol.match(/^(https?)/) || ['']).shift() ?? '',
        domain: url.host,
        path: url.pathname,
        query: url.search,
      },
    };

    const session = await getSession();

    if (session?.user) {
      // Elastic Common Schema : https://www.elastic.co/guide/en/ecs/current/ecs-user.html
      log.user = {
        email: session.user.email,
        siret: session.user.siret,
        scopes: session.user.scopes,
      };

      if (log.user.email) {
        log.user.domain = (log.user.email.match(/@(.*)/) || ['']).shift();
      }
    }
    // eslint-disable-next-line no-console
    console.info(JSON.stringify(log));
  } catch (e) {
    logErrorInSentry(
      new Exception({
        name: 'SensitiveRequestLoggerFailed',
        message: 'Error while logging sensitive request',
        cause: e,
        context: {
          details: route,
        },
      })
    );
  }
};
