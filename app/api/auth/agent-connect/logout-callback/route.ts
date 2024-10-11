import logErrorInSentry from '#utils/sentry';
import { cleanAgentSession, cleanPathFrom, getPathFrom } from '#utils/session';
import withSession from '#utils/session/with-session';
import { redirectTo } from '../../utils';
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
