import { Exception, FetchRessourceException } from "#models/exceptions";
import { DataStore } from "#utils/data-store";
import { logFatalErrorInSentry } from "#utils/sentry";
import {
  type IAgentMonitoring,
  type IAgentRateLimits,
  numberOfRequestByAgentList,
} from "./number-of-requests-by-agent-list";

export class AgentOverRateLimitException extends Exception {
  constructor() {
    super({
      name: "AgentOverRateLimitException",
      message: "Agent over rate limit",
    });
  }
}

const RATE_LIMITS = {
  TEN_MINUTES: 200,
  ONE_HOUR: 400,
  ONE_DAY: 2400,
  ONE_WEEK: 10_000,
} as const;

class AgentRateLimiter {
  private _agentRateLimitsStore: DataStore<IAgentRateLimits>;
  // time before agent rate limits update
  private TTL = 300_000; // 5min

  constructor() {
    this._agentRateLimitsStore = new DataStore<IAgentRateLimits>(
      () => numberOfRequestByAgentList(),
      "number-of-request-by-agent-list",
      this.mapResponseToAgentRateLimits,
      this.TTL
    );
  }

  mapResponseToAgentRateLimits = (response: IAgentMonitoring[]) =>
    response.reduce(
      (acc, agentMonitoring) => {
        const email = agentMonitoring.email;
        acc[email] = agentMonitoring.rateLimits;
        return acc;
      },
      {} as { [key: string]: IAgentRateLimits }
    );

  getAgentRateLimits = async (email: string) => {
    try {
      const agentRateLimits =
        (await this._agentRateLimitsStore.get(email)) ?? null;
      return agentRateLimits;
    } catch (e: any) {
      logFatalErrorInSentry(
        new FetchRessourceException({
          ressource: "AgentRateLimiter",
          cause: e,
        })
      );
      return null;
    }
  };

  verify = async (email: string) => {
    const agentRateLimits = await this.getAgentRateLimits(email);

    if (
      agentRateLimits &&
      (agentRateLimits.tenMinutes > RATE_LIMITS.TEN_MINUTES ||
        agentRateLimits.pastHour > RATE_LIMITS.ONE_HOUR ||
        agentRateLimits.pastDay > RATE_LIMITS.ONE_DAY ||
        agentRateLimits.pastWeek > RATE_LIMITS.ONE_WEEK)
    ) {
      throw new AgentOverRateLimitException();
    }
  };
}

export const agentRateLimiter = new AgentRateLimiter();
