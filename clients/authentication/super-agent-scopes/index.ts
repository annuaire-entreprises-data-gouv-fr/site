import { FetchRessourceException } from '#models/exceptions';
import { IAgentScope } from '#models/user/scopes';
import { logFatalErrorInSentry } from '#utils/sentry';

import { DataStore } from '#clients/data-store';
import { clientSuperAgentList, IAgentRecord } from './client-super-agent-list';
import { mapToAgentScopes } from './map-to-agent-scopes';

class SuperAgentsScopes {
  private _superAgentsStore: DataStore<IAgentScope[]>;
  // time before agent list update
  private TTL = 300000; //1000 * 60 * 5

  constructor() {
    this._superAgentsStore = new DataStore<IAgentScope[]>(
      () => clientSuperAgentList(),
      'comptes-super-agents',
      this.mapResponseToAgentScopes,
      this.TTL
    );
  }

  mapResponseToAgentScopes = (
    response: IAgentRecord[]
  ): { [key: string]: IAgentScope[] } =>
    response
      .filter((r) => r.actif === true)
      .reduce((acc: { [key: string]: IAgentScope[] }, agent) => {
        acc[agent.email] = mapToAgentScopes(agent.scopes);
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
