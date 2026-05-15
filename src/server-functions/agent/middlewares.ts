import { createMiddleware } from "@tanstack/react-start";
import { agentRateLimiter } from "#/clients/authentication/rate-limiter/index.server";
import { HttpBadRequestError } from "#/clients/exceptions";
import { UseCase } from "#/models/use-cases";
import getSession from "#/utils/server-side-helper/get-session";

export const withRateLimiting = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const session = await getSession();
    const sessionEmail = session?.user?.email ?? null;

    if (!sessionEmail) {
      throw new HttpBadRequestError("User email not found");
    }

    await agentRateLimiter.verify(sessionEmail);

    return await next();
  }
);

interface UseCaseInput {
  useCase: UseCase;
}
export const withUseCase = createMiddleware({ type: "function" }).server(
  async ({ next, data }) => {
    const useCase = data ? (data as UseCaseInput).useCase : null;
    if (!useCase || !Object.values(UseCase).includes(useCase)) {
      throw new HttpBadRequestError("Invalid useCase");
    }

    return await next();
  }
);
