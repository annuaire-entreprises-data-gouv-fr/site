import { proConnectLogoutUrl } from '#clients/authentication/pro-connect/strategy';
import logErrorInSentry from '#utils/sentry';
import { getBaseUrl } from '#utils/server-side-helper/app/get-base-url';
import { setPathFrom } from '#utils/session';
import withSession from '#utils/session/with-session';
import { NextResponse } from 'next/server';
import { AgentConnectLogoutFailedException } from '../agent-connect-types';

export const GET = withSession(async function logoutRoute(req) {
  try {
    const referer = req.headers.get('referer') || '';
    const baseURL = getBaseUrl();
    const isFromSite = referer.indexOf(baseURL) === 0;

    await setPathFrom(
      req.session,
      (isFromSite && new URL(referer).pathname) || ''
    );
    const url = await proConnectLogoutUrl(req);
    return NextResponse.redirect(url);
  } catch (e: any) {
    logErrorInSentry(new AgentConnectLogoutFailedException({ cause: e }));
    return NextResponse.redirect(getBaseUrl() + '/connexion/au-revoir');
  }
});
