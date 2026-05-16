import { createFileRoute, redirect } from "@tanstack/react-router";
import { setCookie } from "@tanstack/react-start/server";
import { ProConnect2FANeeded } from "#/clients/authentication/pro-connect/exceptions";
import {
  proConnectAuthenticate,
  proConnectAuthorizeUrl,
} from "#/clients/authentication/pro-connect/strategy.server";
import { AgentConnected } from "#/models/authentication/agent/agent-connected";
import {
  AgentConnectionFailedException,
  CanRequestAuthorizationException,
  NeedASiretException,
  OrganisationNotAnAdministration,
  PrestataireException,
} from "#/models/authentication/authentication-exceptions";
import { getBaseUrl } from "#/utils/get-base-url";
import { logFatalErrorInSentry, logInfoInSentry } from "#/utils/sentry";
import {
  cleanPathFrom,
  getCurrentSession,
  getPathFrom,
  setAgentSession,
} from "#/utils/session/index.server";
import { defaultHeadersMiddleware } from "../../-middlewares";

export const Route = createFileRoute("/api/auth/agent-connect/callback")({
  server: {
    middleware: [defaultHeadersMiddleware()],
    handlers: {
      GET: async () => {
        const session = await getCurrentSession();

        try {
          const userInfo = await proConnectAuthenticate();
          const agent = new AgentConnected(userInfo);
          const agentInfo = await agent.getAndVerifyAgentInfo();

          await setAgentSession(agentInfo, session);

          const pathFrom = decodeURIComponent(getPathFrom(session) || "");

          let path = "/";
          if (pathFrom) {
            await cleanPathFrom(session);
            path = pathFrom;
          }

          setCookie("user-was-logged-in", "true", {
            maxAge: 60 * 60 * 24 * 30,
            path: "/",
            sameSite: "strict",
          });

          return redirect({ href: getBaseUrl() + path });
        } catch (e) {
          if (e instanceof ProConnect2FANeeded) {
            try {
              const newAuthUrl = await proConnectAuthorizeUrl({
                force2FA: true,
                loginHint: e.loginHint,
                skipStateGeneration: true,
              });

              return redirect({ href: newAuthUrl });
            } catch {
              return redirect({
                href: getBaseUrl() + "/connexion/echec-connexion",
              });
            }
          }

          logFatalErrorInSentry(
            new AgentConnectionFailedException({
              cause: e,
              context: {
                slug: "siret non renseigné",
              },
            })
          );

          if (e instanceof PrestataireException) {
            return redirect({
              href: getBaseUrl() + "/connexion/habilitation/prestataires",
            });
          }
          if (e instanceof CanRequestAuthorizationException) {
            return redirect({
              href:
                getBaseUrl() +
                `/connexion/habilitation/requise?siren=${e.context.siren}&name=${encodeURIComponent(e.context.details ?? "")}`,
            });
          }
          if (e instanceof NeedASiretException) {
            logInfoInSentry(e);

            return redirect({
              href:
                getBaseUrl() +
                "/connexion/habilitation/administration-inconnue",
            });
          }
          if (e instanceof OrganisationNotAnAdministration) {
            return redirect({
              href:
                getBaseUrl() +
                `/connexion/habilitation/refusee?siren=${e.context.siren}&name=${encodeURIComponent(e.context.details ?? "")}`,
            });
          }

          return redirect({
            href: getBaseUrl() + "/connexion/echec-connexion",
          });
        }
      },
    },
  },
});
