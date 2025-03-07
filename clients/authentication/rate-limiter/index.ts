import { Exception, FetchRessourceException } from '#models/exceptions';
import { DataStore } from '#utils/data-store';
import { logFatalErrorInSentry } from '#utils/sentry';
import {
  IAgentMonitoring,
  IAgentRateLimits,
  numberOfRequestByAgentList,
} from './number-of-requests-by-agent-list';

export class AgentOverRateLimitsException extends Exception {
  constructor() {
    super({
      name: 'AgentOverRateLimitsException',
      message: 'Agent over rate limits',
    });
  }
}

const RATE_LIMITS = {
  TEN_MINUTES: 100,
  ONE_HOUR: 200,
  ONE_DAY: 1000,
  ONE_WEEK: 5000,
} as const;

class AgentRateLimiter {
  private _agentRateLimitsStore: DataStore<IAgentRateLimits>;
  // time before agent rate limits update
  private TTL = 300000; // 5min

  constructor() {
    this._agentRateLimitsStore = new DataStore<IAgentRateLimits>(
      () => numberOfRequestByAgentList(),
      'number-of-request-by-agent-list',
      this.mapResponseToAgentRateLimits,
      this.TTL
    );
  }

  mapResponseToAgentRateLimits = (response: IAgentMonitoring[]) =>
    response.reduce((acc, agentMonitoring) => {
      const email = agentMonitoring.email;
      acc[email] = agentMonitoring.rateLimits;
      return acc;
    }, {} as { [key: string]: IAgentRateLimits });

  getRateLimitsForAgent = async (email: string) => {
    try {
      const rateLimits = (await this._agentRateLimitsStore.get(email)) ?? null;
      return rateLimits;
    } catch (e: any) {
      logFatalErrorInSentry(
        new FetchRessourceException({
          ressource: 'AgentRateLimiter',
          cause: e,
        })
      );
      return null;
    }
  };

  verify = async (email?: string) => {
    if (!email) {
      return null;
    }
    const rateLimits = await this.getRateLimitsForAgent(email);

    if (
      rateLimits &&
      (rateLimits.tenMinutes > RATE_LIMITS.TEN_MINUTES ||
        rateLimits.pastHour > RATE_LIMITS.ONE_HOUR ||
        rateLimits.pastDay > RATE_LIMITS.ONE_DAY ||
        rateLimits.pastWeek > RATE_LIMITS.ONE_WEEK)
    ) {
      throw new AgentOverRateLimitsException();
    }
  };
}

export const agentRateLimiter = new AgentRateLimiter();
