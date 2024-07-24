import { FranceConnectAuthorizeUrl } from '#clients/authentication/france-connect/strategy';
import { logFatalErrorInSentry } from '#utils/sentry';
import withSession from '#utils/session/with-session';
import { FranceConnectFailedException } from './callback';

export default withSession(async function loginRoute(req, res) {
  try {
    const url = await FranceConnectAuthorizeUrl(req);
    res.redirect(url);
  } catch (e: any) {
    logFatalErrorInSentry(new FranceConnectFailedException({ cause: e }));
    res.redirect('/connexion/echec-connexion');
  }
});
