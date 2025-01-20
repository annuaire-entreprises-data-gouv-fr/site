import { Exception } from '#models/exceptions';
import { UseCase } from '#models/user/agent';
import { ISession } from '#models/user/session';
import logErrorInSentry, { logInfoInSentry } from '#utils/sentry';
import { IReqWithSession } from '#utils/session/with-session';
import { NextRequest, userAgent } from 'next/server';
import { APIRoutesPaths } from './routes-paths';

export type IContext = { params: Promise<{ slug: Array<string> }> };

type RouteHandler = (
  request: NextRequest,
  context: IContext
) => Promise<Response>;

type RouteHandlerWithSession = (
  request: IReqWithSession,
  context: IContext
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
export function withIgnoreBot(
  handler: RouteHandlerWithSession
): RouteHandlerWithSession {
  return async function (request, context) {
    const { isBot } = userAgent(request);
    const routeAndSlug = await getRouteAndSlug(context);

    if (isBot) {
      throw new APIRouteError(
        'Antibot activated : user is a bot',
        routeAndSlug,
        401
      );
    }

    const session = request.session;
    if (!userVisitedAPageRecently(session)) {
      throw new APIRouteError(
        'Antiscrap activated : user tries to scrap',
        routeAndSlug,
        401
      );
    }

    return handler(request, context);
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
    context: { route: string; slug: string; params?: { useCase: UseCase } },
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

export async function getRouteAndSlug(context: {
  params: Promise<{ slug: Array<string> }>;
}) {
  try {
    const params = await context.params;
    const slug = params.slug.at(-1) as string;
    const route = params.slug.slice(0, -1).join('/') as APIRoutesPaths;
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
        routeAndSlug = await getRouteAndSlug(context);
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

export function withUseCase<TResult>(
  handler: (slug: string, useCase: UseCase) => TResult
) {
  return (slug: string, params: { useCase: UseCase }): TResult => {
    if (!('useCase' in params) || params.useCase in UseCase) {
      throw new APIRouteError(
        'Invalid useCase',
        { slug, route: 'withUseCase', params },
        400
      );
    }

    return handler(slug, params.useCase);
  };
}
