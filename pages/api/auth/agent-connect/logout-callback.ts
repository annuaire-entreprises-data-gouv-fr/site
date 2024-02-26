import logErrorInSentry from '#utils/sentry';
import { cleanAgentSession, cleanPathFrom, getPathFrom } from '#utils/session';
import withSession from '#utils/session/with-session';
import { LogoutFailedException } from './logout';

export default withSession(async function loginCallback(req, res) {
  try {
    const session = req.session;
    await cleanAgentSession(session);
    const pathFrom = getPathFrom(session);
    if (pathFrom) {
      await cleanPathFrom(session);
      res.redirect(pathFrom);
    } else {
      res.redirect('/connexion/au-revoir');
    }
  } catch (e: any) {
    logErrorInSentry(new LogoutFailedException({ cause: e }));
    res.redirect('/connexion/au-revoir');
  }
});
