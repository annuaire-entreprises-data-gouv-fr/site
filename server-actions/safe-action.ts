import { redirect } from "next/navigation";
import { createSafeActionClient } from "next-safe-action";
import { ProConnectReconnexionNeeded } from "#clients/authentication/pro-connect/exceptions";
import { HttpNotFound, HttpUnauthorizedError } from "#clients/exceptions";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import { InternalError } from "#models/exceptions";
import { logFatalErrorInSentry } from "#utils/sentry";
import getSession from "#utils/server-side-helper/get-session";

export type ServerActionError = {
  message: string;
  status: number;
};

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if (error instanceof ProConnectReconnexionNeeded) {
      return redirect("/api/auth/agent-connect/login");
    }

    if (error instanceof HttpUnauthorizedError) {
      return {
        message: "Unauthorized",
        status: 401,
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
        message: "Internal error in Safe Action",
        cause: error,
      })
    );

    return {
      message: "Internal server error",
      status: 500,
    };
  },
});

export const agentActionClient = actionClient.use(async ({ next }) => {
  const session = await getSession();

  if (
    !hasRights(session, ApplicationRights.isAgent) ||
    !session?.user?.email ||
    !session?.user?.proConnectSub
  ) {
    throw new HttpUnauthorizedError("Unauthorized: Agent access required");
  }

  return next({ ctx: { session } });
});
