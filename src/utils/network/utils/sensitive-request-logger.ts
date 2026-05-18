import { Exception } from "#/models/exceptions";
import { extractSirenOrSiretSlugFromUrl, randomId } from "#/utils/helpers";
import logErrorInSentry from "#/utils/sentry";

interface ISensitiveLogType {
  content: {
    resource_type: string | null;
    resource_id: string | null;
  };
  date: string;
  request: {
    route: string;
    id: string;
  };
  timestamp: number;
  url: {
    scheme: string;
    domain: string;
    path: string;
    query: string;
  };
  useCase?: string;
  user: ISensitiveCaller;
}

// Elastic Common Schema : https://www.elastic.co/guide/en/ecs/current/ecs-user.html
export interface ISensitiveCaller {
  domain: string;
  email: string;
  scopes: string[];
  siret: string | null;
}

/**
 * Dedicated logger for sensitive requests.
 *
 * Has to be called in addition to regular log
 *
 * @param route
 */
export const sensitiveRequestLogger = (
  route: string,
  user: ISensitiveCaller,
  useCase?: string
) => {
  try {
    const url = new URL(route);

    const resource_type = url.pathname
      .replace(/\d{14}|\d{9}/, "")
      .replace("//", "/");

    const resource_id = extractSirenOrSiretSlugFromUrl(url.pathname);

    const log: ISensitiveLogType = {
      date: new Date().toISOString(),
      timestamp: Date.now(),

      request: {
        route,
        id: randomId(),
      },

      content: {
        resource_type,
        resource_id,
      },

      // Elastic Common Schema : https://www.elastic.co/guide/en/ecs/current/ecs-url.html
      url: {
        scheme: (url.protocol.match(/^(https?)/) || [""]).shift() ?? "",
        domain: url.host,
        path: url.pathname,
        query: url.search,
      },
      user,
      useCase,
    };

    console.info(JSON.stringify(log));
  } catch (e) {
    logErrorInSentry(
      new Exception({
        name: "SensitiveRequestLoggerFailed",
        message: "Error while logging sensitive request",
        cause: e,
        context: {
          details: route,
        },
      })
    );
  }
};
