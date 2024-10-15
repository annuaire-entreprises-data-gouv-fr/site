import { franceConnectLogoutUrl } from '#clients/authentication/france-connect/strategy';
import logErrorInSentry from '#utils/sentry';
import { getAbsoluteSiteUrl } from '#utils/server-side-helper/app/get-absolute-site-url';
import { setPathFrom } from '#utils/session';
import withSession from '#utils/session/with-session';
import { NextResponse } from 'next/server';
import { FranceConnectLogoutFailedException } from '../france-connect-types';

export const GET = withSession(async function logoutRoute(req) {
  try {
    await setPathFrom(
      req.session,
      (req.nextUrl.searchParams.get('pathFrom') || '') as string
    );
    const url = await franceConnectLogoutUrl(req);
    return NextResponse.redirect(url);
  } catch (e: any) {
    logErrorInSentry(new FranceConnectLogoutFailedException({ cause: e }));
    return NextResponse.redirect(getAbsoluteSiteUrl('/connexion/au-revoir'));
  }
});
