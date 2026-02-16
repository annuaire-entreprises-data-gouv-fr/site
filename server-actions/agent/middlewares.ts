import type { MiddlewareFn } from "next-safe-action";
import type { ServerActionError } from "server-actions/safe-action";
import { agentRateLimiter } from "#clients/authentication/rate-limiter";
import { HttpBadRequestError } from "#clients/exceptions";
import {
  type ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { Exception } from "#models/exceptions";
import { UseCase } from "#models/use-cases";

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
