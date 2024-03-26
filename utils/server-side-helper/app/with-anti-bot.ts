import { userAgent } from 'next/server';
import { Information } from '#models/exceptions';
import { ISession } from '#models/user/session';
import { logInfoInSentry } from '#utils/sentry';
import getSession from './get-session';

/**
 * IgnoreBot
 *
 * @description
 * This function is a wrapper for API routes that ignore good bots calls
 *
 * @param handler
 * @returns
 */
export function withIgnoreBot<T>(
  apiRoute: (
    request: Request,
    params: T,
    session: ISession | null
  ) => Promise<Response>,
  fallback: unknown = {}
) {
  return withAntiScrapping(async function (request: Request, params: T) {
    const { isBot } = userAgent(request);
    const session = await getSession();

    if (isBot) {
      logInfoInSentry(
        new Information({
          name: 'IgnoreByBotActivated',
          message: 'This API ignored the bot request',
          context: { page: request.url },
        })
      );

      return Response.json(fallback || {}, { status: 200 });
    } else {
      return await apiRoute(request, params, session);
    }
  });
}

/**
 * AntiBot
 *
 * @description
 * This function is a wrapper for API routes that forbid scrapping calls
 *
 *
 * @param handler
 * @returns
 */
export function withAntiScrapping<T>(apiRoute: any) {
  return async function (request: Request, params: T) {
    const session = await getSession();

    if (!userVisitedAPageRecently(session)) {
      logInfoInSentry(
        new Information({
          name: 'AntibotActivated',
          message:
            'Antibot activated for an API route (no previous session detected)',
          context: { page: request.url },
        })
      );

      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    } else {
      return apiRoute(request, params, session);
    }
  };
}

function userVisitedAPageRecently(session: ISession | null) {
  if (!session?.lastVisitTimestamp) {
    return false;
  }
  const now = new Date();
  const lastVisit = new Date(session?.lastVisitTimestamp);
  const diff = now.getTime() - lastVisit.getTime();
  return diff < 1000 * 60 * 5; // 5 minutes
}
