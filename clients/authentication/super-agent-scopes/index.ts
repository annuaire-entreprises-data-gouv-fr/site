import { FetchRessourceException } from '#models/exceptions';
import { IAgentScope, isAgentScope } from '#models/user/scopes';
import { readFromGrist } from '#utils/integrations/grist';
import { logFatalErrorInSentry } from '#utils/sentry';

class SuperAgentsScopes {
  public _scopesPerAgents = {} as {
    [agentEmail: string]: string;
  };

  getScope = async (email: string) => {
    if (Object.keys(this._scopesPerAgents).length === 0) {
      try {
        const superAgents = await readFromGrist('comptes-agents');

        superAgents
          .filter((r: any) => r.actif === true)
          .forEach((r: any) => {
            this._scopesPerAgents[r.email] = r.scopes;
          });
      } catch (e: any) {
        logFatalErrorInSentry(
          new FetchRessourceException({
            ressource: 'SuperAgentsList',
            cause: e,
          })
        );
      }
    }
    return this._scopesPerAgents[email];
  };
}

const superAgents = new SuperAgentsScopes();

/**
 * Returns any additionnal scopes saved in grist for this email
 * @param agentMail
 * @returns
 */
export const getAdditionnalIAgentScope = async (
  agentMail: string
): Promise<IAgentScope[]> => {
  const scopesRaw = await superAgents.getScope(agentMail);
  return (scopesRaw || '')
    .split(' ')
    .filter((s) => isAgentScope(s)) as IAgentScope[];
};
