import logErrorInSentry from '#utils/sentry';
import { redirectTo } from '#utils/server-side-helper/app/redirect-to';
import { cleanAgentSession, cleanPathFrom, getPathFrom } from '#utils/session';
import withSession from '#utils/session/with-session';
import { AgentConnectLogoutFailedException } from '../agent-connect-types';

export const GET = withSession(async function logoutCallbackRoute(req) {
  try {
    const session = req.session;
    await cleanAgentSession(session);
    const pathFrom = getPathFrom(session);
    if (pathFrom) {
      await cleanPathFrom(session);
      return redirectTo(req, pathFrom);
    } else {
      return redirectTo(req, '/connexion/au-revoir');
    }
  } catch (e: any) {
    logErrorInSentry(new AgentConnectLogoutFailedException({ cause: e }));
    return redirectTo(req, '/connexion/au-revoir');
  }
});
