import { createFileRoute, redirect } from "@tanstack/react-router";
import { getRequestHeader } from "@tanstack/react-start/server";
import { proConnectAuthorizeUrl } from "#/clients/authentication/pro-connect/strategy";
import { AgentConnectionFailedException } from "#/models/authentication/authentication-exceptions";
import { logFatalErrorInSentry } from "#/utils/sentry";
import { getBaseUrl } from "#/utils/server-side-helper/get-base-url";
import {
  cleanAgentSession,
  cleanFranceConnectSession,
  getCurrentSession,
  setPathFrom,
} from "#/utils/session";

export const Route = createFileRoute("/api/auth/agent-connect/login")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await getCurrentSession();

        try {
          await cleanAgentSession(session);
          await cleanFranceConnectSession(session);

          const referer = getRequestHeader("referer") || "";
          const baseURL = getBaseUrl();
          const isFromSite = referer.indexOf(baseURL) === 0;
          const searchParams = new URL(request.url).searchParams;

          const pathFrom =
            searchParams.get("pathFrom") ||
            (isFromSite && new URL(referer).pathname) ||
            "";

          await setPathFrom(session, pathFrom);
          const url = await proConnectAuthorizeUrl({});

          return redirect({ href: url });
        } catch (e) {
          logFatalErrorInSentry(
            new AgentConnectionFailedException({ cause: e })
          );
          return redirect({
            href: getBaseUrl() + "/connexion/echec-connexion",
          });
        }
      },
    },
  },
});
