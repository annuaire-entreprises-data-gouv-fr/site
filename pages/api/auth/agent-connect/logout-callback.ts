import logErrorInSentry from '#utils/sentry';
import {
  cleanAgentSession,
  cleanSirenFrom,
  getSirenFrom,
} from '#utils/session';
import withSession from '#utils/session/with-session';
import { LogoutFailedException } from './logout';

export default withSession(async function loginCallback(req, res) {
  try {
    const session = req.session;
    await cleanAgentSession(session);
    const sirenFrom = getSirenFrom(session);
    if (sirenFrom) {
      await cleanSirenFrom(session);
      res.redirect(`/entreprise/${sirenFrom}`);
    } else {
      res.redirect('/connexion/au-revoir');
    }
  } catch (e: any) {
    logErrorInSentry(new LogoutFailedException({ cause: e }));
    res.redirect('/connexion/au-revoir');
  }
});
