import { agentConnectAuthorizeUrl } from '#clients/authentication/agent-connect/strategy';
import { logFatalErrorInSentry } from '#utils/sentry';
import { setPathFrom } from '#utils/session';
import withSession from '#utils/session/with-session';
import { AgentConnectionFailedException } from '../../../../pages/api/auth/agent-connect/callback';

export default withSession(async function loginRoute(req, res) {
  try {
    // Get the pathFrom from query params or headers
    const pathFrom =
      req.nextUrl.searchParams.get('pathFrom') ||
      req.headers.get('referer') ||
      '';

    await setPathFrom(req.session, pathFrom);
    const url = await agentConnectAuthorizeUrl(req);
    res.redirect(url);
  } catch (e: any) {
    logFatalErrorInSentry(new AgentConnectionFailedException({ cause: e }));
    res.redirect('/connexion/echec-connexion');
  }
});
