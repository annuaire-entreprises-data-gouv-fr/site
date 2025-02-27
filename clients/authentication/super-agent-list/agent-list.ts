import { FetchRessourceException, InternalError } from '#models/exceptions';
import logErrorInSentry, { logFatalErrorInSentry } from '#utils/sentry';

import {
  clientSuperAgentList,
  IAgentRecord,
} from '#clients/authentication/super-agent-list';
import { IAgentScope } from '#models/authentication/agent/scopes';
import { parseAgentScope } from '#models/authentication/agent/scopes/parse';
import { DataStore } from '#utils/data-store';

class SuperAgentsList {
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

  mapResponseToAgentScopes = (
    response: IAgentRecord[]
  ): { [key: string]: IAgentScope[] } =>
    response
      .filter((r) => r.actif === true)
      .reduce((acc: { [key: string]: IAgentScope[] }, agent) => {
        const { inValidScopes, validScopes } = parseAgentScope(agent.scopes);

        if (inValidScopes.length > 0) {
          logErrorInSentry(
            new InternalError({
              message: `Unknown agent scopes : ${inValidScopes.join(',')}`,
            })
          );
        }

        acc[agent.email] = validScopes;
        return acc;
      }, {} as { [key: string]: IAgentScope[] });

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

export const superAgentsList = new SuperAgentsList();
