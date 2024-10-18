import { Exception } from '#models/exceptions';
import { ISession } from '#models/user/session';
import logErrorInSentry, { logInfoInSentry } from '#utils/sentry';
import { userAgent } from 'next/server';
import getSession from '../../../utils/server-side-helper/app/get-session';
import { APIRoutesPaths } from './routes-paths';

type RouteHandler = (
  request: Request,
  context: { params: { slug: Array<string> } }
) => Promise<Response>;

type RouteHandlerWithSession = (
  request: Request,
  context: { params: { slug: Array<string> } },
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
  return async function (request, context) {
    const { isBot } = userAgent(request);
    const routeAndSlug = getRouteAndSlug(context);

    if (isBot) {
      throw new APIRouteError(
        'Antibot activated : user is a bot',
        routeAndSlug,
        401
      );
    }

    const session = await getSession();
    if (!userVisitedAPageRecently(session)) {
      throw new APIRouteError(
        'Antiscrap activated : user has not visited a page recently',
        routeAndSlug,
        401
      );
    }

    return handler(request, context, session);
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
    public status: 400 | 404 | 403 | 500 | 401,
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

export function getRouteAndSlug(context: { params: { slug: Array<string> } }) {
  try {
    const slug = context.params.slug.at(-1) as string;
    const route = context.params.slug.slice(0, -1).join('/') as APIRoutesPaths;
    return { route, slug };
  } catch (e) {
    throw new APIRouteError('Invalid route', { route: '', slug: '' }, 404, e);
  }
}

export function withHandleError(handler: RouteHandler): RouteHandler {
  return async function (request, context) {
    try {
      return await handler(request, context);
    } catch (e) {
      if (e instanceof APIRouteError) {
        logInfoInSentry(e);
        return new Response(e.message, { status: e.status });
      }

      let routeAndSlug;
      try {
        routeAndSlug = getRouteAndSlug(context);
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
