import { agentConnectAuthorizeUrl } from '#clients/auth/agent-connect/strategy';
import { logFatalErrorInSentry } from '#utils/sentry';
import { setSirenFrom } from '#utils/session';
import withSession from '#utils/session/with-session';
import { AgentConnectionFailedException } from './callback';

export default withSession(async function loginRoute(req, res) {
  try {
    await setSirenFrom(req.session, (req?.query?.sirenFrom || '') as string);
    const url = await agentConnectAuthorizeUrl(req);
    res.redirect(url);
  } catch (e: any) {
    logFatalErrorInSentry(new AgentConnectionFailedException({ cause: e }));
    res.redirect('/connexion/echec-connexion');
  }
});
