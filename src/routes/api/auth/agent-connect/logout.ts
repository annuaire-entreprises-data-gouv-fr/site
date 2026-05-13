import { createFileRoute, redirect } from "@tanstack/react-router";
import { proConnectLogoutUrl } from "#/clients/authentication/pro-connect/strategy";
import { AgentConnectionFailedException } from "#/models/authentication/authentication-exceptions";
import logErrorInSentry from "#/utils/sentry";
import { getBaseUrl } from "#/utils/server-side-helper/get-base-url";
import { getCurrentSession, setPathFrom } from "#/utils/session";

export const Route = createFileRoute("/api/auth/agent-connect/logout")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await getCurrentSession();

        try {
          const referer = request.headers.get("referer") || "";
          const baseURL = getBaseUrl();
          const isFromSite = referer.indexOf(baseURL) === 0;

          await setPathFrom(
            session,
            (isFromSite && new URL(referer).pathname) || ""
          );
          const url = await proConnectLogoutUrl();
          return redirect({ href: url });
        } catch (e) {
          logErrorInSentry(new AgentConnectionFailedException({ cause: e }));
          return redirect({ href: getBaseUrl() + "/connexion/au-revoir" });
        }
      },
    },
  },
});
