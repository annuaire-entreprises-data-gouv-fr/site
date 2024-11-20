import { proConnectAuthenticate } from '#clients/authentication/pro-connect/strategy';
import { HttpForbiddenError } from '#clients/exceptions';
import { isServicePublic } from '#models/core/types';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import { getAgent, IAgentInfo } from '#models/user/agent';
import { extractSirenFromSiret } from '#utils/helpers';
import { logFatalErrorInSentry } from '#utils/sentry';
import { getBaseUrl } from '#utils/server-side-helper/app/get-base-url';
import { cleanPathFrom, getPathFrom, setAgentSession } from '#utils/session';
import withSession from '#utils/session/with-session';
import { NextResponse } from 'next/server';
import {
  AgentConnectCouldBeAServicePublicException,
  AgentConnectFailedException,
  AgentConnectMCPNoSiretException,
  AgentConnectProviderNoSiretException,
} from '../agent-connect-types';

export const GET = withSession(async function callbackRoute(req) {
  try {
    const userInfo = await proConnectAuthenticate(req);
    const agent = await getAgent(userInfo);

    await verifyAgentHabilitation(agent);

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
    if (
      e instanceof AgentConnectFailedException ||
      e instanceof AgentConnectProviderNoSiretException ||
      e instanceof AgentConnectMCPNoSiretException
    ) {
      logFatalErrorInSentry(e);
    } else {
      logFatalErrorInSentry(new AgentConnectFailedException({ cause: e }));
    }
    if (e instanceof AgentConnectCouldBeAServicePublicException) {
      return NextResponse.redirect(
        getBaseUrl() + '/connexion/habilitation/requise'
      );
    } else if (e instanceof AgentConnectProviderNoSiretException) {
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
/**
 * Checks if user is either an agent or has habilitation
 * Otherwise raise an exception : HttpForbiddenError or AgentConnectCouldBeAServicePublicException
 */
const verifyAgentHabilitation = async (agent: IAgentInfo) => {
  if (agent.hasHabilitation) {
    return;
  }

  if (!agent.siret) {
    if (agent.isMCP) {
      throw new AgentConnectMCPNoSiretException(
        'The user doesn‘t have a siret',
        agent.userId
      );
    }

    throw new AgentConnectProviderNoSiretException(
      'The provider doesn‘t provide a siret and is not mapped to a siret',
      agent.idpId
    );
  }

  try {
    const siren = extractSirenFromSiret(agent.siret);
    const uniteLegale = await getUniteLegaleFromSlug(siren, {
      page: 0,
      isBot: false,
    });

    if (isServicePublic(uniteLegale)) {
      return;
    }
  } catch (e) {
    throw new AgentConnectFailedException({
      cause: e,
      message: 'Siren verification failed',
      context: {
        siret: agent.siret,
        details: agent.idpId,
      },
    });
  }
  //const couldBeServicePublic =
  //  uniteLegale.natureJuridique.startsWith('4') ||
  //  uniteLegale.natureJuridique.startsWith('8');

  //if (couldBeServicePublic) {
  //  throw new AgentConnectCouldBeAServicePublicException({});
  //}

  throw new HttpForbiddenError('Organization is not a service public');
};
