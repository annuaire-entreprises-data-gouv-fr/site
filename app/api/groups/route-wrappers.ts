import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { FetchRessourceException } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import getSession from '#utils/server-side-helper/app/get-session';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

type RouteHandler<TContext> = (
  request: NextRequest,
  context: TContext
) => Promise<NextResponse>;

export function withAgentAuth<TContext>(handler: RouteHandler<TContext>) {
  return async (request: NextRequest, context: TContext) => {
    const session = await getSession();

    if (
      !hasRights(session, ApplicationRights.isAgent) ||
      !session?.user?.email ||
      !session?.user?.proConnectSub
    ) {
      return NextResponse.json(
        { error: 'Unauthorized: Agent access required' },
        { status: 401 }
      );
    }

    return handler(request, context);
  };
}

export function withErrorHandling<TContext>(
  handler: RouteHandler<TContext>
): RouteHandler<TContext> {
  return async (request: NextRequest, context: TContext) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          { status: 400 }
        );
      }

      if (error instanceof Error && error.name === 'HttpUnauthorizedError') {
        return NextResponse.json(
          { error: 'Unauthorized: Admin permissions required' },
          { status: 403 }
        );
      }

      if (error instanceof Error && error.name === 'HttpNotFoundError') {
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        );
      }

      logErrorInSentry(
        new FetchRessourceException({
          ressource: 'Groups API',
          cause: error,
        })
      );

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
