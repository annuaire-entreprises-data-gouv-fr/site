import { type NextRequest, userAgent } from "next/server";
import {
  AgentOverRateLimitException,
  agentRateLimiter,
} from "#clients/authentication/rate-limiter";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { Exception } from "#models/exceptions";
import { UseCase } from "#models/use-cases";
import logErrorInSentry, { logInfoInSentry } from "#utils/sentry";
import type { IReqWithSession } from "#utils/session/with-session";
import type { APIRoutesPaths } from "./routes-paths";

export type IContext = { params: Promise<{ slug: Array<string> }> };

export interface IHandlerParams {
  useCase?: UseCase;
  isEI?: boolean;
  year?: string;
}

export interface IHandler<TResult, TParams> {
  (slug: string, params: TParams, session: ISession): Promise<TResult>;
}

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
        "Antibot activated : user is a bot",
        routeAndSlug,
        401
      );
    }

    const session = request.session;
    if (
      // agent should not be impacted by the antibot
      !hasRights(session, ApplicationRights.isAgent) &&
      !userVisitedAPageRecently(session)
    ) {
      throw new APIRouteError(
        "Antiscrap activated : user tries to scrap",
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
      params?: IHandlerParams;
    },
    public status: 400 | 404 | 403 | 500 | 401 | 429 | 432,
    cause?: any
  ) {
    super({
      name: "APIRouteError",
      message,
      context: { page: context.route, slug: context.slug },
      cause,
    });
    this.name = "APIRouteError";
  }
}

export async function getRouteAndSlug(context: {
  params: Promise<{ slug: Array<string> }>;
}) {
  try {
    const params = await context.params;
    const slug = params.slug.at(-1) as string;
    const route = params.slug.slice(0, -1).join("/") as APIRoutesPaths;
    return { route, slug };
  } catch (e) {
    throw new APIRouteError("Invalid route", { route: "", slug: "" }, 404, e);
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
        routeAndSlug = { route: "", slug: "" };
      }
      const error = new APIRouteError(
        "Internal Server Error",
        routeAndSlug,
        500,
        e
      );
      logErrorInSentry(error);
      return new Response(error.message, { status: error.status });
    }
  };
}

export function withUseCase<TResult, TParams extends { useCase: UseCase }>(
  handler: (slug: string, params: TParams) => TResult
) {
  return (slug: string, params: TParams): TResult => {
    if (!params?.useCase || !Object.values(UseCase).includes(params.useCase)) {
      throw new APIRouteError(
        "Invalid useCase",
        { slug, route: "withUseCase", params },
        400
      );
    }

    return handler(slug, params);
  };
}

export function withRateLimiting<TResult, TParams>(
  handler: IHandler<TResult, TParams>
) {
  return async (slug: string, params: TParams, session: ISession) => {
    const email = session.user?.email;
    if (!email) {
      throw new APIRouteError(
        "User email not found",
        { slug, route: "withRateLimiting" },
        400
      );
    }
    try {
      await agentRateLimiter.verify(email);
      return handler(slug, params, session);
    } catch (e) {
      if (e instanceof AgentOverRateLimitException) {
        throw new APIRouteError(
          "Agent over rate limit",
          { slug, route: "withRateLimiting" },
          432
        );
      }
      throw e;
    }
  };
}
