import { userAgent } from 'next/server';
import { Exception } from '#models/exceptions';
import { ISession } from '#models/user/session';
import logErrorInSentry, { logInfoInSentry } from '#utils/sentry';
import getSession from '../../../utils/server-side-helper/app/get-session';

type RouteHandler = (
  request: Request,
  params: { params: { slug: Array<string> } }
) => Promise<Response>;

type RouteHandlerWithSession = (
  request: Request,
  params: { params: { slug: Array<string> } },
  session: ISession
) => Promise<Response>;

/**
 * IgnoreBot
 *
 * @description
 * This function is a wrapper for API routes that ignore good bots calls
 *
 * @param handler
 * @returns
 */
export function withIgnoreBot(handler: RouteHandlerWithSession): RouteHandler {
  return async function (request, params) {
    const { isBot } = userAgent(request);
    const routeAndSlug = getRouteAndSlug(params);
    if (isBot) {
      throw new APIRouteError(
        'Antibot Activated : user is a bot',
        routeAndSlug,
        403
      );
    }

    const session = await getSession();
    if (!userVisitedAPageRecently(session)) {
      throw new APIRouteError(
        'Antibot Activated : user has not visited a page recently',
        routeAndSlug,
        403
      );
    }

    return handler(request, params, session);
  };
}

function userVisitedAPageRecently(
  session: ISession | null
): session is ISession {
  if (!session?.lastVisitTimestamp) {
    return false;
  }
  const now = new Date();
  const lastVisit = new Date(session?.lastVisitTimestamp);
  const diff = now.getTime() - lastVisit.getTime();
  return diff < 1000 * 60 * 5; // 5 minutes
}

export class APIRouteError extends Exception {
  constructor(
    message: string,
    context: { route: string; slug: string },
    public status: 404 | 403 | 500,
    cause?: any
  ) {
    super({
      name: 'APIRouteError',
      message,
      context: { page: context.route, slug: context.slug },
      cause,
    });
    this.name = 'APIRouteError';
  }
}

export function getRouteAndSlug(params: { params: { slug: Array<string> } }) {
  try {
    const slug = params.params.slug.at(-1) as string;
    const route = params.params.slug.slice(0, -1).join('/');
    return { route, slug };
  } catch (e) {
    throw new APIRouteError('Invalid route', { route: '', slug: '' }, 404, e);
  }
}

export function withHandleError(handler: RouteHandler): RouteHandler {
  return async function (request, params) {
    try {
      return await handler(request, params);
    } catch (e: any) {
      if (e instanceof APIRouteError) {
        logInfoInSentry(e);
        return new Response(e.message, { status: e.status });
      }

      let routeAndSlug;
      try {
        routeAndSlug = getRouteAndSlug(params);
      } catch (e) {
        routeAndSlug = { route: '', slug: '' };
      }
      const error = new APIRouteError(
        'Internal Server Error',
        routeAndSlug,
        500,
        e
      );
      logErrorInSentry(error);
      return new Response(error.message, { status: error.status });
    }
  };
}
