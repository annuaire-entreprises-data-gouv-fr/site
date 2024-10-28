import logErrorInSentry from '#utils/sentry';
import { getAbsoluteSiteUrl } from '#utils/server-side-helper/app/get-absolute-site-url';
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
      return NextResponse.redirect(getAbsoluteSiteUrl(pathFrom));
    } else {
      return NextResponse.redirect(getAbsoluteSiteUrl('/connexion/au-revoir'));
    }
  } catch (e: any) {
    logErrorInSentry(new AgentConnectLogoutFailedException({ cause: e }));
    return NextResponse.redirect(getAbsoluteSiteUrl('/connexion/au-revoir'));
  }
});
