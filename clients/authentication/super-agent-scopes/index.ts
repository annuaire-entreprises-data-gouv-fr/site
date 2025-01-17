import { FetchRessourceException } from '#models/exceptions';
import { IAgentScope, isAgentScope } from '#models/user/scopes';
import { logFatalErrorInSentry } from '#utils/sentry';

import { DataStore } from '#clients/data-store';
import { readFromGrist } from '#utils/integrations/grist';

class SuperAgentsScopes {
  private _superAgentsStore: DataStore<IAgentScope[]>;
  // time before agent list update
  private TTL = 300000; //1000 * 60 * 5

  constructor() {
    this._superAgentsStore = new DataStore<IAgentScope[]>(
      () => readFromGrist('comptes-agents'),
      'comptes-super-agents',
      this.mapResponseToAgentScopes,
      this.TTL
    );
  }

  convertScopesToAgentScopes = (rawScope: string) => {
    return (rawScope || '')
      .split(' ')
      .filter((s: string) => isAgentScope(s)) as IAgentScope[];
  };

  mapResponseToAgentScopes = (response: any) =>
    response
      .filter((r: any) => r.actif === true)
      .reduce((acc: any, agent: any) => {
        acc[agent.email] = this.convertScopesToAgentScopes(agent.scopes);
        return acc;
      }, {});

  getScopeForAgent = async (email: string) => {
    try {
      return (await this._superAgentsStore.get(email)) ?? [];
    } catch (e: any) {
      logFatalErrorInSentry(
        new FetchRessourceException({
          ressource: 'SuperAgentsList',
          cause: e,
        })
      );
      return [];
    }
  };
}

export const superAgents = new SuperAgentsScopes();
