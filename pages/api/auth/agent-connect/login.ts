import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { agentConnectAuthorizeUrl } from '#clients/auth/agent-connect/strategy';
import { logFatalErrorInSentry } from '#utils/sentry';
import { sessionOptions } from '#utils/session';
import { AgentConnectionFailedException } from './callback';

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const url = await agentConnectAuthorizeUrl();
    res.redirect(url);
  } catch (e: any) {
    logFatalErrorInSentry(new AgentConnectionFailedException({ cause: e }));
    res.redirect('/connexion/echec-connexion');
  }
}
