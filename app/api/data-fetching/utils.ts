import { rateLimitingAgents } from '#clients/authentication/rate-limiting';
import { IMonitoringAgent } from '#clients/authentication/rate-limiting/number-of-requests-by-agent-list';
import { ISession } from '#models/authentication/user/session';
import { Exception } from '#models/exceptions';
import { UseCase } from '#models/use-cases';
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
    context: {
      route: string;
      slug: string;
      params?: { useCase?: UseCase; isEI?: boolean };
    },
    public status: 400 | 404 | 403 | 500 | 401 | 429,
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
  handler: (
    slug: string,
    params: { useCase?: UseCase; isEI?: boolean },
    session: ISession
  ) => TResult
) {
  return (
    slug: string,
    params: { useCase?: UseCase; isEI?: boolean },
    session: ISession
  ) => {
    if (!params.useCase || params.useCase in UseCase) {
      throw new APIRouteError(
        'Invalid useCase',
        { slug, route: 'withUseCase', params },
        400
      );
    }

    return handler(slug, params, session);
  };
}

export function withRateLimiting<TResult>(
  handler: (
    slug: string,
    params: { useCase?: UseCase; isEI?: boolean },
    session: ISession
  ) => Promise<TResult>
) {
  return async (
    slug: string,
    params: { useCase?: UseCase; isEI?: boolean },
    session: ISession
  ) => {
    const rateLimitedAgents = (await rateLimitingAgents.getMonitoringForAgent(
      session.user?.email!
    )) as IMonitoringAgent;

    if (
      rateLimitedAgents['Past 10 minutes'] > 100 ||
      rateLimitedAgents['Past hour'] > 200 ||
      rateLimitedAgents['Past day'] > 1000 ||
      rateLimitedAgents['Past week'] > 5000
    ) {
      throw new APIRouteError(
        'Too many requests',
        { slug, route: 'withUseCase' },
        429
      );
    }

    return handler(slug, params, session);
  };
}
