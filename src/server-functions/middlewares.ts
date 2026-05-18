import { createMiddleware } from "@tanstack/react-start";
import { HttpUnauthorizedError } from "#/clients/exceptions";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import type { ISession } from "#/models/authentication/user/session";
import { Exception } from "#/models/exceptions";
import getSession from "#/utils/server-side-helper/get-session";
import { handleServerError } from "#/utils/server-side-helper/handle-server-error";

export interface ServerActionError {
  message: string;
  status: number;
}

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

export const withApplicationRight = (right: ApplicationRights) =>
  createMiddleware({ type: "function" }).server(async ({ next }) => {
    const session = await getSession();
    verifyApplicationRight(session, right);
    return await next();
  });

const errorMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    try {
      return await next();
    } catch (error) {
      throw handleServerError(error);
    }
  }
);

export const agentFnMiddleware = createMiddleware({ type: "function" })
  .middleware([errorMiddleware])
  .server(async ({ next }) => {
    const session = await getSession();

    if (
      !hasRights(session, ApplicationRights.isAgent) ||
      !session?.user?.email ||
      !session?.user?.proConnectSub
    ) {
      throw new HttpUnauthorizedError("Unauthorized: Agent access required");
    }

    return await next();
  });
