import { HttpUnauthorizedError } from '#clients/exceptions';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { FetchRessourceException } from '#models/exceptions';
import { Group } from '#models/group';
import logErrorInSentry from '#utils/sentry';
import getSession from '#utils/server-side-helper/app/get-session';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const session = await getSession();
    const { groupId } = await params;

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

    const body = await request.json();
    const { userEmail } = body;

    if (!userEmail || typeof userEmail !== 'string') {
      return NextResponse.json(
        { error: 'Invalid user email provided' },
        { status: 400 }
      );
    }

    const groupIdNumber = parseInt(groupId, 10);
    if (isNaN(groupIdNumber)) {
      return NextResponse.json({ error: 'Invalid group ID' }, { status: 400 });
    }

    const group = new Group(groupIdNumber);
    await group.removeUserFromGroup(
      session.user.email,
      session.user.userId,
      userEmail
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof HttpUnauthorizedError) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin permissions required' },
        { status: 403 }
      );
    }

    logErrorInSentry(
      new FetchRessourceException({
        ressource: 'Remove User from Team',
        cause: error,
      })
    );

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
