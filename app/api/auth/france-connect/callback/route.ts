import { franceConnectAuthenticate } from '#clients/authentication/france-connect/strategy';
import logErrorInSentry from '#utils/sentry';
import { redirectTo } from '#utils/server-side-helper/app/redirect-to';
import { setHidePersonalDataRequestFCSession } from '#utils/session';
import withSession from '#utils/session/with-session';
import { FranceConnectFailedException } from '../france-connect-types';

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
    return redirectTo(
      req,
      '/formulaire/supprimer-donnees-personnelles-entreprise'
    );
  } catch (e: any) {
    logErrorInSentry(new FranceConnectFailedException({ cause: e }));
    return redirectTo(req, '/connexion/echec-connexion');
  }
});
