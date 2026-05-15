import { createFileRoute, redirect } from "@tanstack/react-router";
import { franceConnectLogoutUrl } from "#/clients/authentication/france-connect/strategy";
import { Exception } from "#/models/exceptions";
import { getBaseUrl } from "#/utils/get-base-url";
import logErrorInSentry from "#/utils/sentry";
import { getCurrentSession, setPathFrom } from "#/utils/session";
import { defaultHeadersMiddleware } from "../../-middlewares";

class FranceConnectLogoutFailedException extends Exception {
  constructor(args: { cause?: unknown }) {
    super({
      ...args,
      name: "LogoutFailedException",
    });
  }
}

export const Route = createFileRoute("/api/auth/france-connect/logout")({
  server: {
    middleware: [defaultHeadersMiddleware()],
    handlers: {
      GET: async ({ request }) => {
        const session = await getCurrentSession();

        try {
          const searchParams = new URL(request.url).searchParams;
          await setPathFrom(session, searchParams.get("pathFrom") || "");
          const url = await franceConnectLogoutUrl();

          return redirect({ href: url });
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
