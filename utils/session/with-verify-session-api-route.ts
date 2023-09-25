import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { hasSessionId, sessionOptions } from '.';

/**
 * withVerifySessionApiRoute
 *
 * @description
 * This function is a wrapper for API routes that
 * verifies if a session is started before executing
 * the handler.
 *
 * @param handler
 * @returns
 */

export function withVerifySessionApiRoute(handler: NextApiHandler) {
  function verifySession(req: NextApiRequest, res: NextApiResponse) {
    if (!hasSessionId(req.session)) {
      res.status(401).json({ message: 'Session not started' });
      return;
    }
    return handler(req, res);
  }
  return withIronSessionApiRoute(verifySession, sessionOptions);
}

export default withVerifySessionApiRoute;
