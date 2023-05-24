import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  IMCPUserInfo,
  monCompteAuthenticate,
} from '#clients/auth/mon-compte-pro/strategy';
import { HttpForbiddenError } from '#clients/exceptions';
import { isAuthorizedAgent } from '#utils/helpers/is-authorized-agent';
import logErrorInSentry from '#utils/sentry';
import {
  ISessionPrivilege,
  sessionOptions,
  setAgentSession,
} from '#utils/session';

export default withIronSessionApiRoute(callbackRoute, sessionOptions);

const getUserPrivileges = async (
  userInfo: IMCPUserInfo
): Promise<ISessionPrivilege> => {
  const isTestAccount =
    userInfo.email === 'user@yopmail.com' &&
    process.env.NODE_ENV !== 'production';

  const isSuperAgent = await isAuthorizedAgent(userInfo.email);
  if (isTestAccount || isSuperAgent) {
    return 'super-agent';
  }

  const isAgent =
    userInfo.organizations.filter(
      (o) =>
        !o.is_external &&
        (o.is_collectivite_territoriale || o.is_service_public)
    ).length > 0;

  if (isAgent) {
    return 'agent';
  }

  return 'unkown';
};

async function callbackRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userInfo = await monCompteAuthenticate(req);
    const userPrivilege = await getUserPrivileges(userInfo);

    if (userPrivilege === 'unkown') {
      throw new HttpForbiddenError(`Unauthorized account : ${userInfo.email}`);
    }

    await setAgentSession(
      userInfo.email,
      userInfo.family_name,
      userInfo.given_name,
      userPrivilege,
      req.session
    );
    res.redirect('/');
  } catch (e: any) {
    logErrorInSentry('Connexion failed', { details: e.toString() });
    if (e instanceof HttpForbiddenError) {
      res.redirect('/connexion/echec-authorisation-requise');
    } else {
      res.redirect('/connexion/echec-connexion');
    }
  }
}
