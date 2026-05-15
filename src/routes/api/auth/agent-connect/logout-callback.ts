import { createFileRoute, redirect } from "@tanstack/react-router";
import { deleteCookie } from "@tanstack/react-start/server";
import { AgentConnectionFailedException } from "#/models/authentication/authentication-exceptions";
import { getBaseUrl } from "#/utils/get-base-url";
import logErrorInSentry from "#/utils/sentry";
import {
  cleanAgentSession,
  cleanPathFrom,
  getCurrentSession,
  getPathFrom,
} from "#/utils/session/index.server";
import { defaultHeadersMiddleware } from "../../-middlewares";

export const Route = createFileRoute("/api/auth/agent-connect/logout-callback")(
  {
    server: {
      middleware: [defaultHeadersMiddleware()],
      handlers: {
        GET: async () => {
          const session = await getCurrentSession();

          try {
            const pathFrom = getPathFrom(session);
            await cleanAgentSession(session);

            let path = "/connexion/au-revoir";
            if (pathFrom) {
              await cleanPathFrom(session);
              path = pathFrom;
            }

            deleteCookie("user-was-logged-in");

            return redirect({ href: getBaseUrl() + path });
          } catch (e) {
            logErrorInSentry(new AgentConnectionFailedException({ cause: e }));
            return redirect({ href: getBaseUrl() + "/connexion/au-revoir" });
          }
        },
      },
    },
  }
);
