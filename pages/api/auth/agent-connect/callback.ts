import {
  IAgentConnectUserInfo,
  agentConnectAuthenticate,
} from '#clients/auth/agent-connect/strategy';
import { HttpForbiddenError } from '#clients/exceptions';
import { Exception } from '#models/exceptions';
import { checkIsSuperAgent } from '#utils/helpers/is-super-agent';
import { logFatalErrorInSentry } from '#utils/sentry';
import {
  ISessionPrivilege,
  cleanPathFrom,
  getPathFrom,
  setAgentSession,
} from '#utils/session';
import withSession from '#utils/session/with-session';

const getUserPrivileges = async (
  userInfo: IAgentConnectUserInfo
): Promise<ISessionPrivilege> => {
  const isTestAccount =
    userInfo.email === 'user@yopmail.com' &&
    process.env.NODE_ENV !== 'production';

  const isSuperAgent = await checkIsSuperAgent(userInfo.email);
  if (isTestAccount || isSuperAgent) {
    return 'super-agent';
  }

  // agent connect only connect agents
  return 'agent';
};

export default withSession(async function callbackRoute(req, res) {
  try {
    const userInfo = await agentConnectAuthenticate(req);
    const userPrivilege = await getUserPrivileges(userInfo);
    const session = req.session;

    if (userPrivilege === 'unkown') {
      throw new HttpForbiddenError(`Unauthorized account : ${userInfo.email}`);
    }

    await setAgentSession(
      userInfo.email,
      userInfo.family_name || '',
      userInfo.given_name || '',
      userPrivilege,
      session
    );

    const pathFrom = getPathFrom(session);

    if (pathFrom) {
      await cleanPathFrom(session);
      res.redirect(pathFrom);
    } else {
      res.redirect('/');
    }
  } catch (e: any) {
    logFatalErrorInSentry(new AgentConnectionFailedException({ cause: e }));
    if (e instanceof HttpForbiddenError) {
      res.redirect('/connexion/echec-authorisation-requise');
    } else {
      res.redirect('/connexion/echec-connexion');
    }
  }
});

export class AgentConnectionFailedException extends Exception {
  constructor(args: { cause?: any }) {
    super({
      name: 'AgentConnectionFailedException',
      ...args,
    });
  }
}
