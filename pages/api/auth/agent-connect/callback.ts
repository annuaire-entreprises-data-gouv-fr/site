import { agentConnectAuthenticate } from '#clients/authentication/agent-connect/strategy';
import { HttpForbiddenError } from '#clients/exceptions';
import { clientUniteLegaleRechercheEntreprise } from '#clients/recherche-entreprise/siren';
import { isServicePublic } from '#models/core/types';
import { Exception } from '#models/exceptions';
import { getAgent } from '#models/user/agent';
import { isAgentScope } from '#models/user/scopes';
import { extractSirenFromSiret } from '#utils/helpers';
import { logFatalErrorInSentry } from '#utils/sentry';
import { cleanPathFrom, getPathFrom, setAgentSession } from '#utils/session';
import withSession from '#utils/session/with-session';

export default withSession(async function callbackRoute(req, res) {
  try {
    const userInfo = await agentConnectAuthenticate(req);
    const agent = await getAgent(userInfo);

    const isWhitelisted = agent.scopes.some((scope) => isAgentScope(scope));
    const { isMCP } = agent;

    if (!isWhitelisted && isMCP) {
      const siren = extractSirenFromSiret(agent.siret);
      const uniteLegale = await clientUniteLegaleRechercheEntreprise(siren, 0);

      const isNotServicePublic = !isServicePublic(uniteLegale);
      // TODO filter base on uniteLegal if it's not a service public for sure
      const couldBeServicePublic = true;

      if (isNotServicePublic) {
        if (couldBeServicePublic) {
          return res.redirect('/connexion/habilitation-requise');
        } else {
          return res.redirect('/connexion/echec-autorisation-requise');
        }
      }
    }
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
