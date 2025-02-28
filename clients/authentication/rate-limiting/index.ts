import { FetchRessourceException } from '#models/exceptions';
import { logFatalErrorInSentry } from '#utils/sentry';

import { DataStore } from '#utils/data-store';
import {
  IMonitoringAgent,
  numberOfRequestByAgentList,
} from './number-of-requests-by-agent-list';

class RateLimitingAgents {
  private _rateLimitingAgentsStore: DataStore<IMonitoringAgent>;
  // time before rate limiting agents list update
  private TTL = 300000; // 5min

  constructor() {
    this._rateLimitingAgentsStore = new DataStore<IMonitoringAgent>(
      () => numberOfRequestByAgentList(),
      'number-of-request-by-agent-list',
      this.mapResponseToMonitoringAgent,
      this.TTL
    );
  }

  mapResponseToMonitoringAgent = (
    response: IMonitoringAgent[]
  ): { [key: string]: IMonitoringAgent } =>
    response.reduce((acc, agent) => {
      const email = agent.Agent;
      acc[email] = agent;
      return acc;
    }, {} as { [key: string]: IMonitoringAgent });

  getMonitoringForAgent = async (email: string) => {
    try {
      return (await this._rateLimitingAgentsStore.get(email)) ?? [];
    } catch (e: any) {
      logFatalErrorInSentry(
        new FetchRessourceException({
          ressource: 'RateLimitingAgentsList',
          cause: e,
        })
      );
      return [];
    }
  };
}

export const rateLimitingAgents = new RateLimitingAgents();
