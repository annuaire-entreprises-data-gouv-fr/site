import logErrorInSentry from '#utils/sentry';
import { getURL } from '#utils/server-side-helper/app/get-url';
import { cleanAgentSession, cleanPathFrom, getPathFrom } from '#utils/session';
import withSession from '#utils/session/with-session';
import { NextResponse } from 'next/server';
import { AgentConnectLogoutFailedException } from '../agent-connect-types';

export const GET = withSession(async function logoutCallbackRoute(req) {
  try {
    const session = req.session;
    await cleanAgentSession(session);
    const pathFrom = getPathFrom(session);
    if (pathFrom) {
      await cleanPathFrom(session);
      return NextResponse.redirect(getURL(pathFrom));
    } else {
      return NextResponse.redirect(getURL('/connexion/au-revoir'));
    }
  } catch (e: any) {
    logErrorInSentry(new AgentConnectLogoutFailedException({ cause: e }));
    return NextResponse.redirect(getURL('/connexion/au-revoir'));
  }
});
