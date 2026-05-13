import { createFileRoute, redirect } from "@tanstack/react-router";
import { deleteCookie } from "@tanstack/react-start/server";
import { AgentConnectionFailedException } from "#/models/authentication/authentication-exceptions";
import logErrorInSentry from "#/utils/sentry";
import { getBaseUrl } from "#/utils/server-side-helper/get-base-url";
import {
  cleanAgentSession,
  cleanPathFrom,
  getCurrentSession,
  getPathFrom,
} from "#/utils/session";

export const Route = createFileRoute("/api/auth/agent-connect/logout-callback")(
  {
    server: {
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
