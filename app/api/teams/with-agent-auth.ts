import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import getSession from '#utils/server-side-helper/app/get-session';
import { NextRequest, NextResponse } from 'next/server';

type RouteHandler = (
  request: NextRequest,
  context: any
) => Promise<NextResponse>;

export function withAgentAuth(handler: RouteHandler) {
  return async (request: NextRequest, context: any) => {
    const session = await getSession();

    if (
      !hasRights(session, ApplicationRights.isAgent) ||
      !session?.user?.email ||
      !session?.user?.userId
    ) {
      return NextResponse.json(
        { error: 'Unauthorized: Agent access required' },
        { status: 401 }
      );
    }

    return handler(request, context);
  };
}
