import { agentConnectAuthorizeUrl } from '#clients/authentication/agent-connect/strategy';
import { logFatalErrorInSentry } from '#utils/sentry';
import { setPathFrom } from '#utils/session';
import withSession from '#utils/session/with-session';
import { NextResponse } from 'next/server';
import { redirectTo } from '../../utils';
import { AgentConnectFailedException } from '../agent-connect-types';

export const GET = withSession(async function loginRoute(req) {
  try {
    const pathFrom =
      req.nextUrl.searchParams.get('pathFrom') ||
      req.headers.get('referer') ||
      '';

    await setPathFrom(req.session, pathFrom);
    const url = await agentConnectAuthorizeUrl(req);
    return NextResponse.redirect(url);
  } catch (e: any) {
    logFatalErrorInSentry(new AgentConnectFailedException({ cause: e }));
    return redirectTo(req, '/connexion/echec-connexion');
  }
});
