import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { monCompteProGetToken } from '#clients/auth/mon-compte-pro/strategy';
import logErrorInSentry from '#utils/sentry';
import { sessionOptions } from '#utils/session';

async function callbackRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userInfo = await monCompteProGetToken(req);
    req.session.user = {
      email: userInfo.email,
    };

    await req.session.save();

    res.redirect('/');
  } catch (e: any) {
    logErrorInSentry('Connexion failed', { details: e.toString() });
    res.redirect('/connexion/echec-connexion');
  }
}

export default withIronSessionApiRoute(callbackRoute, sessionOptions);
