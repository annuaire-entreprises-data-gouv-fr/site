import { Group } from '#models/group';
import getSession from '#utils/server-side-helper/app/get-session';
import { NextRequest, NextResponse } from 'next/server';
import { addUserSchema, groupIdParamSchema } from '../../input-validation';
import { withAgentAuth, withErrorHandling } from '../../route-wrappers';

async function addUserHandler(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getSession();
  const { groupId } = await params;

  const validatedParams = groupIdParamSchema.parse({ groupId });

  const body = await request.json();
  const validatedData = addUserSchema.parse(body);

  const group = new Group(validatedParams.groupId);
  const user = await group.addUser(
    session!.user!.email,
    session!.user!.userId,
    validatedData.userEmail,
    validatedData.roleId
  );

  return NextResponse.json(user);
}

export const POST = withAgentAuth(withErrorHandling(addUserHandler));
