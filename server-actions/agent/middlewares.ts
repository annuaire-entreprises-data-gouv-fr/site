import type { MiddlewareFn } from "next-safe-action";
import type { ServerActionError } from "server-actions/safe-action";
import { HttpBadRequestError } from "#clients/exceptions";
import type { ApplicationRights } from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { UseCase } from "#models/use-cases";
import {
  verifyAgentRateLimit,
  verifyApplicationRight,
} from "../../server-fetch/agent/middlewares";

export const withRateLimiting: MiddlewareFn<
  ServerActionError,
  unknown,
  { session: ISession },
  {}
> = async ({ next, ctx }) => {
  const session = ctx.session;

  await verifyAgentRateLimit(session?.user?.email ?? null);
  return next();
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

    verifyApplicationRight(session, right);
    return next();
  };
