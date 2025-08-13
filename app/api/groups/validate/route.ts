import { Groups } from '#models/authentication/group/groups';
import getSession from '#utils/server-side-helper/app/get-session';
import { NextResponse } from 'next/server';
import { validateSchema } from '../input-validation';
import { withAgentAuth, withErrorHandling } from '../route-wrappers';

async function validateHandler(request: Request) {
  const session = await getSession();

  const body = await request.json();
  const validatedData = validateSchema.parse(body);

  const group = await Groups.validateGroup(
    session!.user!.email,
    session!.user!.proConnectSub,
    validatedData.demandeId,
    validatedData.groupName,
    validatedData.emails
  );

  return NextResponse.json(group);
}

export const POST = withAgentAuth(withErrorHandling(validateHandler));
