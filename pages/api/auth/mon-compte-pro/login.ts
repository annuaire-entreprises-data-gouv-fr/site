import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { monCompteProAuthorizeUrl } from '#clients/auth/mon-compte-pro/strategy';
import { logFatalErrorInSentry } from '#utils/sentry';
import { sessionOptions } from '#utils/session';
import { AgentConnectionFailedException } from './callback';

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const url = await monCompteProAuthorizeUrl();
    res.redirect(url);
  } catch (e: any) {
    logFatalErrorInSentry(new AgentConnectionFailedException({ cause: e }));
    res.redirect('/connexion/echec-connexion');
  }
}
