import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  IMCPUserInfo,
  monCompteAuthenticate,
} from '#clients/auth/mon-compte-pro/strategy';
import { HttpForbiddenError } from '#clients/exceptions';
import { Exception } from '#models/exceptions';
import { checkIsSuperAgent } from '#utils/helpers/is-super-agent';
import { logFatalErrorInSentry } from '#utils/sentry';
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

  const isSuperAgent = await checkIsSuperAgent(userInfo.email);
  if (isTestAccount || isSuperAgent) {
    return 'super-agent';
  }

  const {
    is_external = false,
    is_collectivite_territoriale = false,
    is_service_public = false,
  } = userInfo;

  const isAgent =
    !is_external && (is_collectivite_territoriale || is_service_public);

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
      userInfo.family_name || '',
      userInfo.given_name || '',
      userPrivilege,
      req.session
    );
    res.redirect('/');
  } catch (e: any) {
    logFatalErrorInSentry(new AgentConnectionFailedException({ cause: e }));
    if (e instanceof HttpForbiddenError) {
      res.redirect('/connexion/echec-authorisation-requise');
    } else {
      res.redirect('/connexion/echec-connexion');
    }
  }
}

export class AgentConnectionFailedException extends Exception {
  constructor(args: { cause?: any }) {
    super({
      name: 'AgentConnectionFailedException',
      ...args,
    });
  }
}
