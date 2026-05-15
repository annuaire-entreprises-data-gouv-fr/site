import { redirect } from "@tanstack/react-router";
import { ProConnectReconnexionNeeded } from "#/clients/authentication/pro-connect/exceptions";
import { AgentOverRateLimitException } from "#/clients/authentication/rate-limiter/index.server";
import { HttpNotFound, HttpUnauthorizedError } from "#/clients/exceptions";
import { Exception, InternalError } from "#/models/exceptions";
import { logFatalErrorInSentry } from "#/utils/sentry";

export class MissingApplicationRightException extends Exception {
  constructor(args: {
    message: string;
    cause?: any;
  }) {
    super({ name: "MissingApplicationRightException", ...args });
  }
}

export function handleServerError(error: unknown) {
  if (error instanceof ProConnectReconnexionNeeded) {
    throw redirect({ to: "/api/auth/agent-connect/login" });
  }

  if (error instanceof AgentOverRateLimitException) {
    return {
      message: "Agent over rate limit",
      status: 432,
    };
  }

  if (error instanceof HttpUnauthorizedError) {
    return {
      message: "Unauthorized",
      status: 401,
    };
  }

  if (error instanceof MissingApplicationRightException) {
    return {
      message: "Missing right",
      status: 433,
    };
  }

  if (error instanceof HttpNotFound) {
    return {
      message: "Not found",
      status: 404,
    };
  }

  logFatalErrorInSentry(
    new InternalError({
      message: "Internal error",
      cause: error,
    })
  );

  return {
    message: "Internal server error",
    status: 500,
  };
}
