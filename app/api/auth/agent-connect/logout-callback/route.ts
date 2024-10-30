import logErrorInSentry from '#utils/sentry';
import { getBaseUrl } from '#utils/server-side-helper/app/get-base-url';
import { cleanAgentSession, cleanPathFrom, getPathFrom } from '#utils/session';
import withSession from '#utils/session/with-session';
import { NextResponse } from 'next/server';
import { AgentConnectLogoutFailedException } from '../agent-connect-types';

export const GET = withSession(async function logoutCallbackRoute(req) {
  try {
    const session = req.session;
    const pathFrom = getPathFrom(session);
    await cleanAgentSession(session);
    if (pathFrom) {
      await cleanPathFrom(session);
      return NextResponse.redirect(getBaseUrl() + pathFrom);
    } else {
      return NextResponse.redirect(getBaseUrl() + '/connexion/au-revoir');
    }
  } catch (e: any) {
    logErrorInSentry(new AgentConnectLogoutFailedException({ cause: e }));
    return NextResponse.redirect(getBaseUrl() + '/connexion/au-revoir');
  }
});
