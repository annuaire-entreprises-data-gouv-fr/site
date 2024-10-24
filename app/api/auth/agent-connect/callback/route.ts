import { agentConnectAuthenticate } from '#clients/authentication/agent-connect/strategy';
import { HttpForbiddenError } from '#clients/exceptions';
import { getAgent } from '#models/user/agent';
import { logFatalErrorInSentry } from '#utils/sentry';
import { getBaseUrl } from '#utils/server-side-helper/app/get-base-url';
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
      return NextResponse.redirect(getBaseUrl() + pathFrom);
    } else {
      return NextResponse.redirect(getBaseUrl() + '/');
    }
  } catch (e: any) {
    logFatalErrorInSentry(new AgentConnectFailedException({ cause: e }));
    if (e instanceof HttpForbiddenError) {
      return NextResponse.redirect(
        getBaseUrl() + '/connexion/echec-authorisation-requise'
      );
    } else {
      return NextResponse.redirect(getBaseUrl() + '/connexion/echec-connexion');
    }
  }
});
