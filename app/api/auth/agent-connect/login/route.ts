import { agentConnectAuthorizeUrl } from '#clients/authentication/agent-connect/strategy';
import { logFatalErrorInSentry } from '#utils/sentry';
import { getBaseUrl } from '#utils/server-side-helper/app/get-base-url';
import { setPathFrom } from '#utils/session';
import withSession from '#utils/session/with-session';
import { NextResponse } from 'next/server';
import { AgentConnectFailedException } from '../agent-connect-types';

export const GET = withSession(async function loginRoute(req) {
  try {
    const referer = req.headers.get('referer') || '';
    const baseURL = getBaseUrl();
    const isFromSite = referer.indexOf(baseURL) === 0;

    const pathFrom =
      req.nextUrl.searchParams.get('pathFrom') ||
      (isFromSite && new URL(referer).pathname) ||
      '';

    await setPathFrom(req.session, pathFrom);
    const url = await agentConnectAuthorizeUrl(req);
    return NextResponse.redirect(url);
  } catch (e: any) {
    logFatalErrorInSentry(new AgentConnectFailedException({ cause: e }));
    return NextResponse.redirect(getBaseUrl() + '/connexion/echec-connexion');
  }
});
