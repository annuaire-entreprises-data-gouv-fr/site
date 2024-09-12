import { agentConnectAuthenticate } from '#clients/authentication/agent-connect/strategy';
import { HttpForbiddenError } from '#clients/exceptions';
import { Exception } from '#models/exceptions';
import { IAgentInfo, getAgent } from '#models/user/agent';
import { formatDatePartial } from '#utils/helpers';
import { logInGrist } from '#utils/integrations/grist';
import { logFatalErrorInSentry } from '#utils/sentry';
import { cleanPathFrom, getPathFrom, setAgentSession } from '#utils/session';
import withSession from '#utils/session/with-session';

const logConnexion = (agent: IAgentInfo) => {
  // log connexion in grist - no need to await
  const date = new Date().toISOString();
  logInGrist('logs-connexion', [
    {
      type: agent.userType,
      userID: agent.userId,
      idpID: agent.idpId,
      siret: agent.siret,
      domain: agent.domain,
      date,
      mois: formatDatePartial(date),
    },
  ]);
};

export default withSession(async function callbackRoute(req, res) {
  try {
    const userInfo = await agentConnectAuthenticate(req);
    const agent = await getAgent(userInfo);
    const session = req.session;
    await setAgentSession(agent, session);

    const pathFrom = decodeURIComponent(getPathFrom(session) || '');

    logConnexion(agent);

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
