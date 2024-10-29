import { franceConnectAuthorizeUrl } from '#clients/authentication/france-connect/strategy';
import { logFatalErrorInSentry } from '#utils/sentry';
import { getBaseUrl } from '#utils/server-side-helper/app/get-base-url';
import withSession from '#utils/session/with-session';
import { NextResponse } from 'next/server';
import { FranceConnectFailedException } from '../france-connect-types';

export const GET = withSession(async function loginRoute(req) {
  try {
    const url = await franceConnectAuthorizeUrl(req);
    return NextResponse.redirect(url);
  } catch (e: any) {
    logFatalErrorInSentry(new FranceConnectFailedException({ cause: e }));
    return NextResponse.redirect(getBaseUrl() + '/connexion/echec-connexion');
  }
});
