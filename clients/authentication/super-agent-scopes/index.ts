import { FetchRessourceException, InternalError } from '#models/exceptions';
import { IAgentScope, isAgentScope } from '#models/user/scopes';
import logErrorInSentry, { logFatalErrorInSentry } from '#utils/sentry';

import { DataStore } from '#clients/data-store';
import { clientSuperAgentList, IAgentRecord } from './client-super-agent-list';

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

  convertScopesToAgentScopes = (rawScope: string): IAgentScope[] => {
    const scopes = (rawScope || '').split(' ');
    const inValidScopes = [];
    const validScopes = [] as IAgentScope[];

    for (let i = 0; i < scopes.length; i++) {
      const scope = scopes[i];
      if (isAgentScope(scope)) {
        validScopes.push(scope);
      } else {
        inValidScopes.push(scope);
      }
    }

    if (inValidScopes.length > 0) {
      logErrorInSentry(
        new InternalError({
          message: `Unknown agent scopes : ${inValidScopes.join(',')}`,
        })
      );
    }

    return validScopes;
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
