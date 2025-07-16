import { getRoles } from '#clients/api-d-roles';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { FetchRessourceException } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import getSession from '#utils/server-side-helper/app/get-session';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
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

    const roles = await getRoles();

    return NextResponse.json(roles);
  } catch (error) {
    logErrorInSentry(
      new FetchRessourceException({
        ressource: 'Get Available Roles',
        cause: error,
      })
    );

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
