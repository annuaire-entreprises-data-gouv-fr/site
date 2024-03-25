import { agentConnectAuthenticate } from '#clients/auth/agent-connect/strategy';
import { HttpForbiddenError } from '#clients/exceptions';
import { Exception } from '#models/exceptions';
import getRights from '#models/user/rights';
import { getUserScopes } from '#models/user/scopes';
import { logFatalErrorInSentry } from '#utils/sentry';
import { cleanPathFrom, getPathFrom, setAgentSession } from '#utils/session';
import withSession from '#utils/session/with-session';

export default withSession(async function callbackRoute(req, res) {
  try {
    const userInfo = await agentConnectAuthenticate(req);
    const { scopes, userType } = await getUserScopes(userInfo?.email);
    const rights = await getRights(scopes);
    const session = req.session;

    await setAgentSession(
      userInfo.email,
      userInfo.family_name ?? '',
      userInfo.given_name ?? '',
      userInfo.siret ?? '',
      rights,
      userType,
      session
    );

    const pathFrom = decodeURIComponent(getPathFrom(session) || '');

    if (pathFrom) {
      await cleanPathFrom(session);
      res.redirect(pathFrom);
    } else {
      res.redirect('/');
    }
  } catch (e: any) {
    logFatalErrorInSentry(new AgentConnectionFailedException({ cause: e }));
    if (e instanceof HttpForbiddenError) {
      res.redirect('/connexion/echec-authorisation-requise');
    } else {
      res.redirect('/connexion/echec-connexion');
    }
  }
});

export class AgentConnectionFailedException extends Exception {
  constructor(args: { cause?: any }) {
    super({
      name: 'AgentConnectionFailedException',
      ...args,
    });
  }
}
