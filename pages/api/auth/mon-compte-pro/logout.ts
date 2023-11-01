import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { monCompteProLogoutUrl } from '#clients/auth/mon-compte-pro/strategy';
import logErrorInSentry from '#utils/sentry';
import { sessionOptions } from '#utils/session';

export default withIronSessionApiRoute(logoutRoute, sessionOptions);

async function logoutRoute(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const url = await monCompteProLogoutUrl();
    res.redirect(url);
  } catch (e: any) {
    logErrorInSentry(e, { errorName: 'Logout failed' });
    res.redirect('/connexion/au-revoir');
  }
}
