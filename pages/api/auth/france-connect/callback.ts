import { franceConnectAuthenticate } from '#clients/auth/france-connect/strategy';
import { Exception } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { setHidePersonalDataRequestFCSession } from '#utils/session';
import withSession from '#utils/session/with-session';

export default withSession(async function (req, res) {
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
    res.redirect('/formulaire/supprimer-donnees-personnelles-entreprise');
  } catch (e: any) {
    logErrorInSentry(new FranceConnectFailedException({ cause: e }));
    res.redirect('/connexion/echec-connexion');
  }
});

export class FranceConnectFailedException extends Exception {
  constructor(args: { cause?: any }) {
    super({
      name: 'FranceConnectFailedException',
      ...args,
    });
  }
}
