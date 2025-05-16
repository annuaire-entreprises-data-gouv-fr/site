import { parseAgentScopes } from '#clients/api-d-roles/parse';
import {
  clientSuperAgentList,
  IAgentRecord,
} from '#clients/authentication/super-agents/client-super-agent-list';
import { IAgentScope } from '#models/authentication/agent/scopes/constants';
import { FetchRessourceException, InternalError } from '#models/exceptions';
import { DataStore } from '#utils/data-store';
import logErrorInSentry, { logFatalErrorInSentry } from '#utils/sentry';

type ISuperAgentRecord = {
  scopes: IAgentScope[];
  usage: string;
};

class SuperAgentsList {
  private _superAgentsStore: DataStore<ISuperAgentRecord>;
  // time before agent list update
  private TTL = 300000; // 5min

  constructor() {
    this._superAgentsStore = new DataStore<ISuperAgentRecord>(
      () => clientSuperAgentList(),
      'comptes-super-agents',
      this.mapResponseToAgentScopes,
      this.TTL
    );
  }

  mapResponseToAgentScopes = (
    response: IAgentRecord[]
  ): { [key: string]: ISuperAgentRecord } =>
    response
      .filter((r) => r.actif === true)
      .reduce((acc, agent) => {
        const { inValidScopes, validScopes } = parseAgentScopes(agent.scopes);

        if (inValidScopes.length > 0) {
          logErrorInSentry(
            new InternalError({
              message: `Unknown agent scopes : ${inValidScopes.join(',')}`,
            })
          );
        }
        acc[agent.email] = { scopes: validScopes, usage: agent.usage };
        return acc;
      }, {} as { [key: string]: ISuperAgentRecord });

  getScopeForAgent = async (email: string) => {
    try {
      return (await this._superAgentsStore.get(email))?.scopes ?? [];
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

  getAllAgents = async () => {
    return await this._superAgentsStore.getData();
  };
}

export const superAgentsList = new SuperAgentsList();
