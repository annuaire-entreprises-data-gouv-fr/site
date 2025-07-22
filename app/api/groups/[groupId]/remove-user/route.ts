import getSession from '#utils/server-side-helper/app/get-session';
import { NextRequest, NextResponse } from 'next/server';
import { removeUserSchema } from '../../input-validation';
import { getGroup } from '../../route-helpers';
import { withAgentAuth, withErrorHandling } from '../../route-wrappers';

async function removeUserHandler(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getSession();
  const group = await getGroup(params);

  const body = await request.json();
  const validatedData = removeUserSchema.parse(body);

  await group.removeUserFromGroup(
    session!.user!.email,
    session!.user!.userId,
    validatedData.userEmail
  );

  return NextResponse.json({ success: true });
}

export const POST = withAgentAuth(withErrorHandling(removeUserHandler));
