import { agentConnectAuthenticate } from '#clients/authentication/agent-connect/strategy';
import { HttpForbiddenError } from '#clients/exceptions';
import { getAgent } from '#models/user/agent';
import { logFatalErrorInSentry } from '#utils/sentry';
import { cleanPathFrom, getPathFrom, setAgentSession } from '#utils/session';
import withSession from '#utils/session/with-session';
import { redirectTo } from '../../utils';
import { AgentConnectFailedException } from '../agent-connect-types';

export const GET = withSession(async function callbackRoute(req) {
  try {
    const userInfo = await agentConnectAuthenticate(req);
    const agent = await getAgent(userInfo);
    const session = req.session;
    await setAgentSession(agent, session);

    const pathFrom = decodeURIComponent(getPathFrom(session) || '');

    if (pathFrom) {
      await cleanPathFrom(session);
      return redirectTo(req, pathFrom);
    } else {
      return redirectTo(req, '/');
    }
  } catch (e: any) {
    logFatalErrorInSentry(new AgentConnectFailedException({ cause: e }));
    if (e instanceof HttpForbiddenError) {
      return redirectTo(req, '/connexion/echec-authorisation-requise');
    } else {
      return redirectTo(req, '/connexion/echec-connexion');
    }
  }
});
