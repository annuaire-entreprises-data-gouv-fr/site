import { agentConnectAuthenticate } from '#clients/authentication/agent-connect/strategy';
import { HttpForbiddenError } from '#clients/exceptions';
import { getAgent } from '#models/user/agent';
import { logFatalErrorInSentry } from '#utils/sentry';
import { getAbsoluteSiteUrl } from '#utils/server-side-helper/app/get-absolute-site-url';
import { cleanPathFrom, getPathFrom, setAgentSession } from '#utils/session';
import withSession from '#utils/session/with-session';
import { NextResponse } from 'next/server';
import { AgentConnectFailedException } from '../agent-connect-types';

export const GET = withSession(async function callbackRoute(req) {
  try {
    const userInfo = await agentConnectAuthenticate(req);
    const agent = await getAgent(userInfo);
    const session = req.session;
    await setAgentSession(agent, session);

    const pathFrom = decodeURIComponent(getPathFrom(session) || '');

    if (pathFrom) {
      await cleanPathFrom(session);
      return NextResponse.redirect(getAbsoluteSiteUrl(pathFrom));
    } else {
      return NextResponse.redirect(getAbsoluteSiteUrl('/'));
    }
  } catch (e: any) {
    logFatalErrorInSentry(new AgentConnectFailedException({ cause: e }));
    if (e instanceof HttpForbiddenError) {
      return NextResponse.redirect(
        getAbsoluteSiteUrl('/connexion/echec-authorisation-requise')
      );
    } else {
      return NextResponse.redirect(
        getAbsoluteSiteUrl('/connexion/echec-connexion')
      );
    }
  }
});
