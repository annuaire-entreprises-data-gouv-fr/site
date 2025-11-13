import { agentRateLimiter } from "#clients/authentication/rate-limiter";
import { HttpBadRequestError } from "#clients/exceptions";
import getSession from "./get-session";

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
