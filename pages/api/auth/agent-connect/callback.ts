import { agentConnectAuthenticate } from '#clients/authentication/agent-connect/strategy';
import { HttpForbiddenError } from '#clients/exceptions';
import { isServicePublic } from '#models/core/types';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import { Exception } from '#models/exceptions';
import { IAgentInfo, getAgent } from '#models/user/agent';
import { extractSirenFromSiret } from '#utils/helpers';
import { logFatalErrorInSentry } from '#utils/sentry';
import { cleanPathFrom, getPathFrom, setAgentSession } from '#utils/session';
import withSession from '#utils/session/with-session';

export default withSession(async function callbackRoute(req, res) {
  try {
    const userInfo = await agentConnectAuthenticate(req);
    const agent = await getAgent(userInfo);

    await verifyAgentHabilitation(agent);

    const session = req.session;
    await setAgentSession(agent, session);

    const pathFrom = decodeURIComponent(getPathFrom(session) || '');

    if (pathFrom) {
      await cleanPathFrom(session);
      res.redirect(pathFrom);
    } else {
      res.redirect('/');
    }
  } catch (e: any) {
    logFatalErrorInSentry(new AgentConnectionFailedException({ cause: e }));
    if (e instanceof CouldAServicePublicException) {
      return res.redirect('/connexion/habilitation/requise');
    }
    if (e instanceof HttpForbiddenError) {
      res.redirect('/connexion/habilitation/refuse');
    } else {
      res.redirect('/connexion/echec-connexion');
    }
  }
});

const verifyAgentHabilitation = async (agent: IAgentInfo) => {
  if (agent.belongToATeam) {
    return;
  }

  const { isMCP } = agent;

  // MCP should always return a siret
  if (isMCP && !agent.siret) {
    throw new HttpForbiddenError('MCP user must have a siret');
  }

  const siren = extractSirenFromSiret(agent.siret);
  const uniteLegale = await getUniteLegaleFromSlug(siren, {
    page: 0,
    isBot: false,
  });

  if (isServicePublic(uniteLegale)) {
    return;
  }

  const couldBeServicePublic =
    uniteLegale.natureJuridique.startsWith('4') ||
    uniteLegale.natureJuridique.startsWith('8');

  if (couldBeServicePublic) {
    throw new CouldAServicePublicException({});
  }

  throw new HttpForbiddenError('Organization in not a service public');
};

class CouldAServicePublicException extends Exception {
  constructor(args: { cause?: any }) {
    super({
      name: 'CouldAServicePublicException',
      ...args,
    });
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
