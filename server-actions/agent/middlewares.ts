import type { MiddlewareFn } from "next-safe-action";
import type { ServerActionError } from "server-actions/safe-action";
import {
  AgentOverRateLimitException,
  agentRateLimiter,
} from "#clients/authentication/rate-limiter";
import {
  HttpBadRequestError,
  HttpLocked,
  HttpUnauthorizedError,
} from "#clients/exceptions";
import {
  type ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { UseCase } from "#models/use-cases";

export const withRateLimiting: MiddlewareFn<
  ServerActionError,
  unknown,
  { session: ISession },
  {}
> = async ({ next, ctx }) => {
  const session = ctx.session;

  const email = session?.user?.email;

  if (!email) {
    throw new HttpBadRequestError("User email not found");
  }

  try {
    await agentRateLimiter.verify(email);

    return next();
  } catch (e) {
    if (e instanceof AgentOverRateLimitException) {
      throw new HttpLocked("Agent over rate limit");
    }
    throw e;
  }
};

type UseCaseInput = {
  useCase: UseCase;
};
export const withUseCase: MiddlewareFn<
  ServerActionError,
  unknown,
  { session: ISession },
  {}
> = async ({ next, clientInput }) => {
  const useCase = clientInput ? (clientInput as UseCaseInput).useCase : null;
  if (!useCase || !Object.values(UseCase).includes(useCase)) {
    throw new HttpBadRequestError("Invalid useCase");
  }

  return next();
};

export const withApplicationRight =
  (
    right: ApplicationRights
  ): MiddlewareFn<ServerActionError, unknown, { session: ISession }, {}> =>
  async ({ next, ctx }) => {
    const session = ctx.session;
    if (!hasRights(session, right)) {
      throw new HttpUnauthorizedError(`Unauthorized: ${right} access required`);
    }
    return next();
  };
