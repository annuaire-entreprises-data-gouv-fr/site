import { agentRateLimiter } from "#clients/authentication/rate-limiter";
import { HttpBadRequestError } from "#clients/exceptions";
import {
  type ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { Exception } from "#models/exceptions";
import getSession from "#utils/server-side-helper/get-session";

export class MissingApplicationRightException extends Exception {
  constructor(args: {
    message: string;
    cause?: any;
  }) {
    super({ name: "MissingApplicationRightException", ...args });
  }
}

export function withApplicationRight<T>(
  fn: (...args: any[]) => Promise<T>,
  applicationRight: ApplicationRights,
  session?: ISession | null
) {
  return async (...args: any[]) => {
    const resolvedSession =
      session !== undefined ? session : await getSession();

    if (!hasRights(resolvedSession, applicationRight)) {
      throw new MissingApplicationRightException({
        message: `Unauthorized: ${applicationRight} access required`,
      });
    }

    return fn(...args);
  };
}

export function withAgentRateLimiter<T>(
  fn: (...args: any[]) => Promise<T>,
  sessionEmail?: string | null
) {
  return async (...args: any[]) => {
    const email =
      sessionEmail !== undefined
        ? sessionEmail
        : (await getSession())?.user?.email;

    if (!email) {
      throw new HttpBadRequestError("User email not found");
    }

    await agentRateLimiter.verify(email);

    return fn(...args);
  };
}
