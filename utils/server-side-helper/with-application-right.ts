import { HttpMissingRightError } from "#clients/exceptions";
import {
  type ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import getSession from "./get-session";

export function withApplicationRight<T>(
  fn: (...args: any[]) => Promise<T>,
  applicationRight: ApplicationRights,
  session?: ISession | null
) {
  return async (...args: any[]) => {
    const resolvedSession =
      session !== undefined ? session : await getSession();

    if (!hasRights(resolvedSession, applicationRight)) {
      throw new HttpMissingRightError(
        `Unauthorized: ${applicationRight} access required`
      );
    }

    return fn(...args);
  };
}
