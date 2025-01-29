import { FetchRessourceException } from '#models/exceptions';
import { IAgentScope, isAgentScope } from '#models/user/scopes';
import { logFatalErrorInSentry } from '#utils/sentry';

import { DataStore } from '#clients/data-store';
import { clientSuperAgentList, IAgentRecord } from './client-super-agent-list';

class SuperAgentsScopes {
  private _superAgentsStore: DataStore<IAgentScope[]>;
  // time before agent list update
  private TTL = 300000; //5min

  constructor() {
    this._superAgentsStore = new DataStore<IAgentScope[]>(
      () => clientSuperAgentList(),
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

  mapResponseToAgentScopes = (
    response: IAgentRecord[]
  ): { [key: string]: IAgentScope[] } =>
    response
      .filter((r) => r.actif === true)
      .reduce((acc: { [key: string]: IAgentScope[] }, agent) => {
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
