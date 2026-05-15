import { createFileRoute, redirect } from "@tanstack/react-router";
import { franceConnectAuthenticate } from "#/clients/authentication/france-connect/strategy";
import { Exception } from "#/models/exceptions";
import { getBaseUrl } from "#/utils/get-base-url";
import logErrorInSentry from "#/utils/sentry";
import {
  getCurrentSession,
  setHidePersonalDataRequestFCSession,
} from "#/utils/session";
import { defaultHeadersMiddleware } from "../../-middlewares";

class FranceConnectFailedException extends Exception {
  constructor(args: { cause?: unknown }) {
    super({
      name: "FranceConnectFailedException",
      ...args,
    });
  }
}

export const Route = createFileRoute("/api/auth/france-connect/callback")({
  server: {
    middleware: [defaultHeadersMiddleware()],
    handlers: {
      GET: async () => {
        const session = await getCurrentSession();

        try {
          const userInfo = await franceConnectAuthenticate();
          await setHidePersonalDataRequestFCSession(
            userInfo.given_name,
            userInfo.family_name,
            userInfo.birthdate,
            userInfo.id_token,
            userInfo.sub,
            session
          );

          return redirect({
            href:
              getBaseUrl() +
              "/formulaire/supprimer-donnees-personnelles-entreprise",
          });
        } catch (e) {
          logErrorInSentry(new FranceConnectFailedException({ cause: e }));
          return redirect({
            href: getBaseUrl() + "/connexion/echec-connexion",
          });
        }
      },
    },
  },
});
