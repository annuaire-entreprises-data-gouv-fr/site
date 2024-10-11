import { agentConnectLogoutUrl } from '#clients/authentication/agent-connect/strategy';
import logErrorInSentry from '#utils/sentry';
import { setPathFrom } from '#utils/session';
import withSession from '#utils/session/with-session';
import { NextResponse } from 'next/server';
import { redirectTo } from '../../utils';
import { AgentConnectLogoutFailedException } from '../agent-connect-types';

export const GET = withSession(async function logoutRoute(req) {
  try {
    await setPathFrom(req.session, req.headers.get('referer') || '');
    const url = await agentConnectLogoutUrl(req);
    return NextResponse.redirect(url);
  } catch (e: any) {
    logErrorInSentry(new AgentConnectLogoutFailedException({ cause: e }));
    return redirectTo(req, '/connexion/au-revoir');
  }
});
