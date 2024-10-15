import logErrorInSentry from '#utils/sentry';
import { redirectTo } from '#utils/server-side-helper/app/redirect-to';
import { getPathFrom } from '#utils/session';
import withSession from '#utils/session/with-session';
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
