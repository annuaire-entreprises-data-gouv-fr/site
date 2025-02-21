import { proConnectAuthenticate } from '#clients/authentication/pro-connect/strategy';
import { HttpForbiddenError } from '#clients/exceptions';
import { AgentConnected } from '#models/authentication/agent';
import {
  AgentConnectionFailedException,
  CanRequestAuthorizationException,
  NeedASiretException,
  PrestataireException,
} from '#models/authentication/authentication-exceptions';
import { Information } from '#models/exceptions';
import { logFatalErrorInSentry, logInfoInSentry } from '#utils/sentry';
import { getBaseUrl } from '#utils/server-side-helper/app/get-base-url';
import { cleanPathFrom, getPathFrom, setAgentSession } from '#utils/session';
import withSession from '#utils/session/with-session';
import { NextResponse } from 'next/server';

export const GET = withSession(async function callbackRoute(req) {
  try {
    const userInfo = await proConnectAuthenticate(req);

    if (!userInfo.siret)
      logInfoInSentry(
        new Information({
          name: 'AgentNoSiret',
          message: userInfo.idp_id,
        })
      );

    const agent = new AgentConnected(userInfo);

    const agentInfo = await agent.getAndVerifyAgentInfo();

    const session = req.session;

    await setAgentSession(agentInfo, session);

    const pathFrom = decodeURIComponent(getPathFrom(session) || '');

    let path = '/';
    if (pathFrom) {
      await cleanPathFrom(session);
      path = pathFrom;
    }

    const response = NextResponse.redirect(getBaseUrl() + path);
    response.cookies.set('user-was-logged-in', 'true', {
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    return response;
  } catch (e: any) {
    logFatalErrorInSentry(new AgentConnectionFailedException({ cause: e }));
    if (e instanceof PrestataireException) {
      return NextResponse.redirect(
        getBaseUrl() + '/connexion/habilitation/prestataires'
      );
    } else if (e instanceof CanRequestAuthorizationException) {
      return NextResponse.redirect(
        getBaseUrl() + '/connexion/habilitation/requise'
      );
    } else if (e instanceof NeedASiretException) {
      return NextResponse.redirect(
        getBaseUrl() + '/connexion/habilitation/administration-inconnue'
      );
    } else if (e instanceof HttpForbiddenError) {
      return NextResponse.redirect(
        getBaseUrl() + '/connexion/habilitation/refusee'
      );
    } else {
      return NextResponse.redirect(getBaseUrl() + '/connexion/echec-connexion');
    }
  }
});
