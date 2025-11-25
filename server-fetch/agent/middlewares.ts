import { agentRateLimiter } from "#clients/authentication/rate-limiter";
import { HttpBadRequestError } from "#clients/exceptions";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { IDataFetchingState } from "#models/data-fetching";
import { Exception } from "#models/exceptions";
import {
  type Fetcher,
  type IFetcherFactory,
  withErrorHandler,
} from "../middlewares";

export class MissingApplicationRightException extends Exception {
  constructor(args: {
    message: string;
    cause?: any;
  }) {
    super({ name: "MissingApplicationRightException", ...args });
  }
}

export function verifyApplicationRight(
  session: ISession | null,
  applicationRight: ApplicationRights
) {
  if (!hasRights(session, applicationRight)) {
    throw new MissingApplicationRightException({
      message: `Unauthorized: ${applicationRight} access required`,
    });
  }
}

export async function verifyAgentRateLimit(sessionEmail?: string | null) {
  if (!sessionEmail) {
    throw new HttpBadRequestError("User email not found");
  }

  await agentRateLimiter.verify(sessionEmail);
}

class AgentFetcherFactory<Args extends any[], Result>
  implements IFetcherFactory<[...Args, session: ISession | null], Result>
{
  private _needsRateLimit = false;
  private _requiredRight: ApplicationRights | null = null;

  constructor(private loader: Fetcher<Args, Result>) {}

  withRateLimit() {
    this._needsRateLimit = true;
    return this;
  }

  withApplicationRight(right: ApplicationRights) {
    this._requiredRight = right;
    return this;
  }

  build(): (
    ...args: [...Args, session: ISession | null]
  ) => Promise<
    Result | Exclude<IDataFetchingState, IDataFetchingState.LOADING>
  > {
    return withErrorHandler(
      async (...args: [...Args, session: ISession | null]) => {
        const session = args[args.length - 1] as ISession | null;
        const loaderArgs = args.slice(0, -1) as Args;

        if (!hasRights(session, ApplicationRights.isAgent)) {
          throw new MissingApplicationRightException({
            message: "Unauthorized: Agent access required",
          });
        }

        if (this._needsRateLimit) {
          await verifyAgentRateLimit(session?.user?.email);
        }

        if (this._requiredRight) {
          verifyApplicationRight(session, this._requiredRight);
        }

        return this.loader(...loaderArgs);
      }
    );
  }
}

export const createAgentFetcher = <Args extends any[], Result>(
  loader: Fetcher<Args, Result>
) => new AgentFetcherFactory(loader);
