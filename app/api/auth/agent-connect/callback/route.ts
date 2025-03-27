import { proConnectAuthenticate } from '#clients/authentication/pro-connect/strategy';
import { HttpForbiddenError } from '#clients/exceptions';
import { AgentConnected } from '#models/authentication/agent/agent-connected';
import {
  AgentConnectionFailedException,
  CanRequestAuthorizationException,
  NeedASiretException,
  PrestataireException,
} from '#models/authentication/authentication-exceptions';
import { Information } from '#models/exceptions';
import {
  logFatalErrorInSentry,
  logInfoInSentry,
  logWarningInSentry,
} from '#utils/sentry';
import { getBaseUrl } from '#utils/server-side-helper/app/get-base-url';
import { cleanPathFrom, getPathFrom, setAgentSession } from '#utils/session';
import withSession from '#utils/session/with-session';
import { NextResponse } from 'next/server';

export const GET = withSession(async function callbackRoute(req) {
  let siretForException = '' as string | undefined;
  try {
    const userInfo = await proConnectAuthenticate(req);
    siretForException = userInfo.siret;

    if (!userInfo.siret) {
      logWarningInSentry(
        new Information({
          name: 'NoSiretExceptionnalLogs',
          context: {
            details: `${userInfo.idp_id} - siret: ${userInfo.siret}`,
          },
        })
      );
      if (userInfo.idp_id === '9e139e69-de07-4cbe-987f-d12cb38c0368') {
        userInfo.siret = '11001001400014';
      }
    }

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
    logFatalErrorInSentry(
      new AgentConnectionFailedException({
        cause: e,
        context: { slug: siretForException || 'siret non renseigné' },
      })
    );
    if (e instanceof PrestataireException) {
      return NextResponse.redirect(
        getBaseUrl() + '/connexion/habilitation/prestataires'
      );
    } else if (e instanceof CanRequestAuthorizationException) {
      return NextResponse.redirect(
        getBaseUrl() + '/connexion/habilitation/requise'
      );
    } else if (e instanceof NeedASiretException) {
      logInfoInSentry(e);

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
