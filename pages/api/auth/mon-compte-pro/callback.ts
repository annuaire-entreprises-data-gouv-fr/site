import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { monCompteProGetToken } from '#clients/auth/mon-compte-pro/strategy';
import { HttpForbiddenError } from '#clients/exceptions';
import { isAuthorizedAgent } from '#utils/helpers/is-authorized-agent';
import logErrorInSentry from '#utils/sentry';
import {
  ISessionPrivilege,
  sessionOptions,
  setAgentSession,
} from '#utils/session';

export default withIronSessionApiRoute(callbackRoute, sessionOptions);

async function callbackRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userInfo = await monCompteProGetToken(req);

    const email = userInfo.email;

    if (email) {
      const isTestAccount =
        email === 'user@yopmail.com' && process.env.NODE_ENV !== 'production';

      let userPrivilege = 'none' as ISessionPrivilege;
      const isAdministration = true;

      if (isAdministration) {
        userPrivilege = 'agent';

        const authorized = await isAuthorizedAgent(email);
        if (isTestAccount || authorized) {
          userPrivilege = 'super-agent';
        }

        await setAgentSession(email, userPrivilege, req.session);
        res.redirect('/');
      } else {
        throw new HttpForbiddenError(`${email} is not an authorized email`);
      }
    } else {
      throw new HttpForbiddenError('No email provided');
    }
  } catch (e: any) {
    logErrorInSentry('Connexion failed', { details: e.toString() });
    if (e instanceof HttpForbiddenError) {
      res.redirect('/connexion/echec-authorisation-requise');
    } else {
      res.redirect('/connexion/echec-connexion');
    }
  }
}
