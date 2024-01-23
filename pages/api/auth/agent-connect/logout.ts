import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { agentConnectLogoutUrl } from '#clients/auth/agent-connect/strategy';
import { Exception } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { sessionOptions, setSirenFrom } from '#utils/session';

export default withIronSessionApiRoute(logoutRoute, sessionOptions);

async function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    await setSirenFrom(req.session, (req?.query?.sirenFrom || '') as string);
    const url = await agentConnectLogoutUrl(req);
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
