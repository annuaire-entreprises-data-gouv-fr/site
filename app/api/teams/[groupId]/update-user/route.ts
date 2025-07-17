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
import z from 'zod';
import { groupIdParamSchema, updateUserSchema } from '../../input-validation';

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

    const validatedParams = groupIdParamSchema.parse({ groupId });

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    const group = new Group(validatedParams.groupId);
    await group.updateUser(
      session.user.email,
      session.user.userId,
      validatedData.userEmail,
      validatedData.roleId
    );

    return NextResponse.json({ success: true });
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

    if (error instanceof HttpUnauthorizedError) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin permissions required' },
        { status: 403 }
      );
    }

    logErrorInSentry(
      new FetchRessourceException({
        ressource: 'Update User in Team',
        cause: error,
      })
    );

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
