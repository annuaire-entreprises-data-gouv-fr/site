import { Group } from '#models/group';
import getSession from '#utils/server-side-helper/app/get-session';
import { NextRequest, NextResponse } from 'next/server';
import { groupIdParamSchema, removeUserSchema } from '../../input-validation';
import { withAgentAuth, withErrorHandling } from '../../route-wrappers';

async function removeUserHandler(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
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
}

export const POST = withAgentAuth(withErrorHandling(removeUserHandler));
