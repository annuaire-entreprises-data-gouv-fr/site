import { createSafeActionClient } from "next-safe-action";
import { HttpUnauthorizedError } from "#clients/exceptions";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import getSession from "#utils/server-side-helper/get-session";
import { handleServerError } from "#utils/server-side-helper/handle-server-error";

export type ServerActionError = {
  message: string;
  status: number;
};

export const actionClient = createSafeActionClient({
  handleServerError,
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
