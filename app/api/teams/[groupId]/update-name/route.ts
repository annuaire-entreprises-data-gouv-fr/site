import { Group } from '#models/group';
import getSession from '#utils/server-side-helper/app/get-session';
import { NextRequest, NextResponse } from 'next/server';
import { groupIdParamSchema, updateNameSchema } from '../../input-validation';
import { withAgentAuth, withHandleError } from '../../with-agent-auth';

async function updateNameHandler(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getSession();
  const { groupId } = await params;

  const validatedParams = groupIdParamSchema.parse({ groupId });

  const body = await request.json();
  const validatedData = updateNameSchema.parse(body);

  const group = new Group(validatedParams.groupId);
  await group.updateName(
    session!.user!.email,
    session!.user!.userId,
    validatedData.groupName
  );

  return NextResponse.json({ success: true });
}

export const POST = withAgentAuth(withHandleError(updateNameHandler));
