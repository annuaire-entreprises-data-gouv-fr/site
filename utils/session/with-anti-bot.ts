import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { Information } from '#models/exceptions';
import { logInfoInSentry } from '#utils/sentry';
import { ISession, sessionOptions } from '.';

/**
 * withAntiBot
 *
 * @description
 * This function is a wrapper for API routes that
 * verifies if a session is started before executing
 * the handler.
 *
 * @param handler
 * @returns
 */

export function withAntiBot(handler: NextApiHandler) {
  async function verifySession(req: NextApiRequest, res: NextApiResponse) {
    if (!userVisitedAPageRecently(req.session)) {
      logInfoInSentry(
        new Information({
          name: 'AntibotActivated',
          message:
            'Antibot activated for an API route (no previous session detected)',
          context: { page: req.url },
        })
      );

      res.status(401);
      res.send('Unauthorized');
    }
    return handler(req, res);
  }
  return withIronSessionApiRoute(verifySession, sessionOptions);
}

function userVisitedAPageRecently(session: ISession | null) {
  if (!session?.lastVisitTimestamp) {
    return false;
  }
  const now = new Date();
  const lastVisit = new Date(session.lastVisitTimestamp);
  const diff = now.getTime() - lastVisit.getTime();
  return diff < 1000 * 60 * 5; // 5 minutes
}

export default withAntiBot;
