import logErrorInSentry from '#utils/sentry';
import { getPathFrom } from '#utils/session';
import withSession from '#utils/session/with-session';
import { LogoutFailedException } from './logout';

export default withSession(async function loginCallback(req, res) {
  try {
    const pathFrom = getPathFrom(req.session);

    req.session.destroy();
    await req.session.save();

    if (pathFrom) {
      res.redirect(pathFrom);
    } else {
      res.redirect('/connexion/au-revoir');
    }
  } catch (e: any) {
    logErrorInSentry(new LogoutFailedException({ cause: e }));
    res.redirect('/connexion/au-revoir');
  }
});
