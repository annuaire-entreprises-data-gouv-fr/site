import logErrorInSentry from '#utils/sentry';
import { getURL } from '#utils/server-side-helper/app/get-url';
import { getPathFrom } from '#utils/session';
import withSession from '#utils/session/with-session';
import { NextResponse } from 'next/server';
import { FranceConnectLogoutFailedException } from '../france-connect-types';

export const GET = withSession(async function logoutCallbackRoute(req) {
  try {
    const pathFrom = getPathFrom(req.session);

    req.session.destroy();
    await req.session.save();

    if (pathFrom) {
      return NextResponse.redirect(getURL(pathFrom));
    } else {
      return NextResponse.redirect(getURL('/connexion/au-revoir'));
    }
  } catch (e: any) {
    logErrorInSentry(new FranceConnectLogoutFailedException({ cause: e }));
    return NextResponse.redirect(getURL('/connexion/au-revoir'));
  }
});
