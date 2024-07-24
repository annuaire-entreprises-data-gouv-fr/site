import { agentConnectAuthorizeUrl } from '#clients/authentication/agent-connect/strategy';
import { logFatalErrorInSentry } from '#utils/sentry';
import { setPathFrom } from '#utils/session';
import withSession from '#utils/session/with-session';
import { AgentConnectionFailedException } from './callback';

export default withSession(async function loginRoute(req, res) {
  try {
    await setPathFrom(req.session, (req?.query?.pathFrom || '') as string);
    const url = await agentConnectAuthorizeUrl(req);
    res.redirect(url);
  } catch (e: any) {
    logFatalErrorInSentry(new AgentConnectionFailedException({ cause: e }));
    res.redirect('/connexion/echec-connexion');
  }
});
