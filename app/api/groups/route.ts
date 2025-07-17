import { Groups } from '#models/groups';
import getSession from '#utils/server-side-helper/app/get-session';
import { NextResponse } from 'next/server';
import { withAgentAuth, withErrorHandling } from './route-wrappers';

async function getGroupsHandler() {
  const session = await getSession();

  const groups = await Groups.find(session!.user!.email, session!.user!.userId);

  return NextResponse.json(groups);
}

export const GET = withAgentAuth(withErrorHandling(getGroupsHandler));
