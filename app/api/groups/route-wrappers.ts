import { HttpNotFound, HttpUnauthorizedError } from '#clients/exceptions';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import getSession from '#utils/server-side-helper/app/get-session';
import { NextResponse } from 'next/server';
import z from 'zod';

type RouteHandler<TContext> = (
  request: Request,
  context: TContext
) => Promise<Response>;

export function withAgentAuth<TContext>(handler: RouteHandler<TContext>) {
  return async (request: Request, context: TContext) => {
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
  return async (request: Request, context: TContext) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new NextResponse('Validation failed', { status: 400 });
      }

      if (error instanceof HttpUnauthorizedError) {
        return new NextResponse('Unauthorized: Admin permissions required', {
          status: 403,
        });
      }

      if (error instanceof HttpNotFound) {
        return new NextResponse('Resource not found', { status: 404 });
      }

      return new NextResponse('Internal server error', { status: 500 });
    }
  };
}
