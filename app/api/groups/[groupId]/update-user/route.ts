import { Group } from '#models/group';
import getSession from '#utils/server-side-helper/app/get-session';
import { NextRequest, NextResponse } from 'next/server';
import { groupIdParamSchema, updateUserSchema } from '../../input-validation';
import { withAgentAuth, withErrorHandling } from '../../route-wrappers';

async function updateUserHandler(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getSession();
  const { groupId } = await params;

  const validatedParams = groupIdParamSchema.parse({ groupId });

  const body = await request.json();
  const validatedData = updateUserSchema.parse(body);

  const group = new Group(validatedParams.groupId);
  await group.updateUser(
    session!.user!.email,
    session!.user!.userId,
    validatedData.userEmail,
    validatedData.roleId
  );

  return NextResponse.json({ success: true });
}

export const POST = withAgentAuth(withErrorHandling(updateUserHandler));
