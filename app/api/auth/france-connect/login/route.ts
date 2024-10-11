import { FranceConnectAuthorizeUrl } from '#clients/authentication/france-connect/strategy';
import { logFatalErrorInSentry } from '#utils/sentry';
import withSession from '#utils/session/with-session';
import { NextResponse } from 'next/server';
import { redirectTo } from '../../utils';
import { FranceConnectFailedException } from '../france-connect-types';

export const GET = withSession(async function loginRoute(req) {
  try {
    const url = await FranceConnectAuthorizeUrl(req);
    return NextResponse.redirect(url);
  } catch (e: any) {
    logFatalErrorInSentry(new FranceConnectFailedException({ cause: e }));
    return redirectTo(req, '/connexion/echec-connexion');
  }
});
