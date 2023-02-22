import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { monCompteProGetToken } from '#clients/auth/mon-compte-pro/strategy';
import { HttpForbiddenError } from '#clients/exceptions';
import { isAuthorizedAgent } from '#utils/helpers/is-authorized-agent';
import logErrorInSentry from '#utils/sentry';
import { sessionOptions } from '#utils/session';

export default withIronSessionApiRoute(callbackRoute, sessionOptions);

async function callbackRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userInfo = await monCompteProGetToken(req);

    const email = userInfo.email;

    if (email) {
      const isTestAccount =
        email === 'user@yopmail.com' && process.env.NODE_ENV !== 'production';

      const authorized = isAuthorizedAgent(email);

      if (isTestAccount || authorized) {
        req.session.user = {
          email,
        };
        await req.session.save();

        res.redirect('/');
      } else {
        throw new HttpForbiddenError(`${email} is not an authorized email`);
      }
    } else {
      throw new HttpForbiddenError('No email provided');
    }
  } catch (e: any) {
    logErrorInSentry('Connexion failed', { details: e.toString() });
    res.redirect('/connexion/echec-authorisation-requise');
  }
}
