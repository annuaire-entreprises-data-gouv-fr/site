import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { logWarningInSentry } from '#utils/sentry';
import { getScope } from '#utils/server-side-props-helper/error-handler';
import { hasSessionId, sessionOptions } from '.';

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
  function verifySession(req: NextApiRequest, res: NextApiResponse) {
    if (!hasSessionId(req.session)) {
      const scope = getScope(req, '');
      logWarningInSentry('Antibot activated for API route', scope);
      res.status(401);

      return;
    }
    return handler(req, res);
  }
  return withIronSessionApiRoute(verifySession, sessionOptions);
}

export default withAntiBot;
