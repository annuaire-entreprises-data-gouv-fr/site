import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import logErrorInSentry from '#utils/sentry';
import { sessionOptions } from '#utils/session';

async function loginCallback(req: NextApiRequest, res: NextApiResponse) {
  try {
    req.session.destroy();
    await req.session.save();
    res.redirect('/connexion/au-revoir');
  } catch (e: any) {
    logErrorInSentry('Logout failed', { details: e.toString() });
    res.redirect('/connexion/au-revoir');
  }
}

export default withIronSessionApiRoute(loginCallback, sessionOptions);
