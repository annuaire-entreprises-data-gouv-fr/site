import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { monCompteProLogoutUrl } from '#clients/auth/mon-compte-pro/strategy';
import { Exception } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { sessionOptions } from '#utils/session';

export default withIronSessionApiRoute(logoutRoute, sessionOptions);

async function logoutRoute(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const url = await monCompteProLogoutUrl();
    res.redirect(url);
  } catch (e: any) {
    logErrorInSentry(new LogoutFailedException({ cause: e }));
    res.redirect('/connexion/au-revoir');
  }
}

export class LogoutFailedException extends Exception {
  constructor(args: { cause?: any }) {
    super({
      ...args,
      name: 'LogoutFailedException',
    });
  }
}
