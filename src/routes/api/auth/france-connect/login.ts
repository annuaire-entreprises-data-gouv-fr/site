import { createFileRoute, redirect } from "@tanstack/react-router";
import { franceConnectAuthorizeUrl } from "#/clients/authentication/france-connect/strategy";
import { Exception } from "#/models/exceptions";
import { getBaseUrl } from "#/utils/get-base-url";
import { logFatalErrorInSentry } from "#/utils/sentry";
import { getCurrentSession } from "#/utils/session";
import { defaultHeadersMiddleware } from "../../-middlewares";

class FranceConnectFailedException extends Exception {
  constructor(args: { cause?: unknown }) {
    super({
      name: "FranceConnectFailedException",
      ...args,
    });
  }
}

export const Route = createFileRoute("/api/auth/france-connect/login")({
  server: {
    middleware: [defaultHeadersMiddleware()],
    handlers: {
      GET: async () => {
        const session = await getCurrentSession();

        try {
          if (session.data.user) {
            throw new Error("User is already logged in with ProConnect");
          }

          const url = await franceConnectAuthorizeUrl();
          return redirect({ href: url });
        } catch (e) {
          logFatalErrorInSentry(new FranceConnectFailedException({ cause: e }));
          return redirect({
            href: getBaseUrl() + "/connexion/echec-connexion",
          });
        }
      },
    },
  },
});
