import type { MiddlewareFn } from "next-safe-action";
import type { ServerActionError } from "server-actions/safe-action";
import { HttpBadRequestError } from "#clients/exceptions";
import type { ApplicationRights } from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { UseCase } from "#models/use-cases";
import { withAgentRateLimiter } from "#utils/server-side-helper/with-agent-rate-limiter";
import { withApplicationRight as withApplicationRightHelper } from "#utils/server-side-helper/with-application-right";

export const withRateLimiting: MiddlewareFn<
  ServerActionError,
  unknown,
  { session: ISession },
  {}
> = async ({ next, ctx }) => {
  const session = ctx.session;

  return withAgentRateLimiter(next, session?.user?.email ?? null)();
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

    return withApplicationRightHelper(next, right, session)();
  };
