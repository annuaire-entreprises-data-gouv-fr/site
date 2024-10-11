import logErrorInSentry from '#utils/sentry';
import { getPathFrom } from '#utils/session';
import withSession from '#utils/session/with-session';
import { redirectTo } from '../../utils';
import { FranceConnectLogoutFailedException } from '../france-connect-types';

export const GET = withSession(async function logoutCallbackRoute(req) {
  try {
    const pathFrom = getPathFrom(req.session);

    req.session.destroy();
    await req.session.save();

    if (pathFrom) {
      return redirectTo(req, pathFrom);
    } else {
      return redirectTo(req, '/connexion/au-revoir');
    }
  } catch (e: any) {
    logErrorInSentry(new FranceConnectLogoutFailedException({ cause: e }));
    return redirectTo(req, '/connexion/au-revoir');
  }
});
