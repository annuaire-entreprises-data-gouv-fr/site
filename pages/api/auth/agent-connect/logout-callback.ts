import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import logErrorInSentry from '#utils/sentry';
import {
  cleanAgentSession,
  cleanSirenFrom,
  getSirenFrom,
  sessionOptions,
} from '#utils/session';
import { LogoutFailedException } from './logout';

export default withIronSessionApiRoute(loginCallback, sessionOptions);

async function loginCallback(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = req.session;
    await cleanAgentSession(session);
    const sirenFrom = getSirenFrom(session);
    if (sirenFrom) {
      await cleanSirenFrom(session);
      res.redirect(`/entreprise/${sirenFrom}`);
    } else {
      res.redirect('/connexion/au-revoir');
    }
  } catch (e: any) {
    logErrorInSentry(new LogoutFailedException({ cause: e }));
    res.redirect('/connexion/au-revoir');
  }
}
