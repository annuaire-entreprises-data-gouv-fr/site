import { HttpUnauthorizedError } from '#clients/exceptions';
import { FetchRessourceException } from '#models/exceptions';
import { Group } from '#models/group';
import logErrorInSentry from '#utils/sentry';
import getSession from '#utils/server-side-helper/app/get-session';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';
import { groupIdParamSchema, removeUserSchema } from '../../input-validation';
import { withAgentAuth } from '../../with-agent-auth';

async function removeUserHandler(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const session = await getSession();
    const { groupId } = await params;

    const validatedParams = groupIdParamSchema.parse({ groupId });

    const body = await request.json();
    const validatedData = removeUserSchema.parse(body);

    const group = new Group(validatedParams.groupId);
    await group.removeUserFromGroup(
      session!.user!.email,
      session!.user!.userId,
      validatedData.userEmail
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

export const POST = withAgentAuth(removeUserHandler);
