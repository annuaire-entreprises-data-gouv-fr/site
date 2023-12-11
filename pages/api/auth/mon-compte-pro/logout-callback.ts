import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import logErrorInSentry from '#utils/sentry';
import { sessionOptions } from '#utils/session';
import { LogoutFailedException } from './logout';

export default withIronSessionApiRoute(loginCallback, sessionOptions);

async function loginCallback(req: NextApiRequest, res: NextApiResponse) {
  try {
    req.session.destroy();
    await req.session.save();
    res.redirect('/connexion/au-revoir');
  } catch (e: any) {
    logErrorInSentry(new LogoutFailedException({ cause: e }));
    res.redirect('/connexion/au-revoir');
  }
}
