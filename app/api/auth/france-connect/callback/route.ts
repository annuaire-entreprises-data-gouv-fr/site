import { franceConnectAuthenticate } from '#clients/authentication/france-connect/strategy';
import logErrorInSentry from '#utils/sentry';
import { getBaseUrl } from '#utils/server-side-helper/app/get-base-url';
import { setHidePersonalDataRequestFCSession } from '#utils/session';
import withSession from '#utils/session/with-session';
import { NextResponse } from 'next/server';
import { FranceConnectFailedException } from '../france-connect-types';

// Local testing tip: to simulate the FranceConnect callback locally, point staging.annuaire-entreprises.data.gouv.fr to 127.0.0.1 in your /etc/hosts file:
// Run `sudo vim /etc/hosts` and add the following line:
// 127.0.0.1 staging.annuaire-entreprises.data.gouv.fr
// Note: Due to HTTPS constraints, direct redirection may not work, but you can manually replace staging.annuaire-entreprises.data.gouv.fr with localhost:3000 in your browser to continue testing.
export const GET = withSession(async function callbackRoute(req) {
  try {
    const userInfo = await franceConnectAuthenticate(req);
    await setHidePersonalDataRequestFCSession(
      userInfo.given_name,
      userInfo.family_name,
      userInfo.birthdate,
      userInfo.id_token,
      userInfo.sub,
      req.session
    );
    return NextResponse.redirect(
      getBaseUrl() + '/formulaire/supprimer-donnees-personnelles-entreprise'
    );
  } catch (e: any) {
    logErrorInSentry(new FranceConnectFailedException({ cause: e }));
    return NextResponse.redirect(getBaseUrl() + '/connexion/echec-connexion');
  }
});
