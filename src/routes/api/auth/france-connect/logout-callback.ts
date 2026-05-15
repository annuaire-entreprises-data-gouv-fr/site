import { createFileRoute, redirect } from "@tanstack/react-router";
import { Exception } from "#/models/exceptions";
import { getBaseUrl } from "#/utils/get-base-url";
import logErrorInSentry from "#/utils/sentry";
import {
  cleanAgentSession,
  getCurrentSession,
  getPathFrom,
} from "#/utils/session";
import { defaultHeadersMiddleware } from "../../-middlewares";

class FranceConnectLogoutFailedException extends Exception {
  constructor(args: { cause?: unknown }) {
    super({
      ...args,
      name: "LogoutFailedException",
    });
  }
}

export const Route = createFileRoute(
  "/api/auth/france-connect/logout-callback"
)({
  server: {
    middleware: [defaultHeadersMiddleware()],
    handlers: {
      GET: async () => {
        const session = await getCurrentSession();

        try {
          const pathFrom = getPathFrom(session);

          await cleanAgentSession(session);
          await session.update({
            FC_CONNECT_CHECK: undefined,
            franceConnectHidePersonalDataSession: undefined,
            pathFrom: undefined,
          });

          if (pathFrom) {
            return redirect({ href: getBaseUrl() + pathFrom });
          }
          return redirect({ href: getBaseUrl() + "/connexion/au-revoir" });
        } catch (e) {
          logErrorInSentry(
            new FranceConnectLogoutFailedException({ cause: e })
          );
          return redirect({ href: getBaseUrl() + "/connexion/au-revoir" });
        }
      },
    },
  },
});
