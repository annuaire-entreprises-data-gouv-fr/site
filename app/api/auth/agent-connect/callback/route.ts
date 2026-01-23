import { NextResponse } from "next/server";
import { ProConnect2FANeeded } from "#clients/authentication/pro-connect/exceptions";
import {
  proConnectAuthenticate,
  proConnectAuthorizeUrl,
} from "#clients/authentication/pro-connect/strategy";
import { AgentConnected } from "#models/authentication/agent/agent-connected";
import {
  AgentConnectionFailedException,
  CanRequestAuthorizationException,
  NeedASiretException,
  OrganisationNotAnAdministration,
  PrestataireException,
} from "#models/authentication/authentication-exceptions";
import { LoggerContext } from "#utils/logger-context";
import { logFatalErrorInSentry, logInfoInSentry } from "#utils/sentry";
import { getBaseUrl } from "#utils/server-side-helper/get-base-url";
import { cleanPathFrom, getPathFrom, setAgentSession } from "#utils/session";
import withSession from "#utils/session/with-session";

export const GET = withSession(async function callbackRoute(req) {
  const loggerContext = new LoggerContext(
    "/api/auth/agent-connect/callback",
    "GET"
  );

  try {
    loggerContext.setContext({
      "session.state": req.session.state?.slice(0, 8) ?? "non renseigné",
      siret: "siret non renseigné",
      "calls.proConnectAuthenticate": false,
    });

    const userInfo = await proConnectAuthenticate(req, loggerContext);

    loggerContext.setContext({
      siret: userInfo.siret,
      "calls.proConnectAuthenticate": true,
    });

    const agent = new AgentConnected(userInfo);

    loggerContext.setContext({
      "calls.AgentConnected": true,
    });

    const agentInfo = await agent.getAndVerifyAgentInfo();

    loggerContext.setContext({
      "calls.agent.getAndVerifyAgentInfo": true,
    });

    const session = req.session;

    await setAgentSession(agentInfo, session);

    const pathFrom = decodeURIComponent(getPathFrom(session) || "");

    let path = "/";
    if (pathFrom) {
      await cleanPathFrom(session);
      path = pathFrom;
    }

    loggerContext.setContext({
      "redirect.path": path,
    });

    const response = NextResponse.redirect(getBaseUrl() + path);
    response.cookies.set("user-was-logged-in", "true", {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    loggerContext.success();

    return response;
  } catch (e: any) {
    if (e instanceof ProConnect2FANeeded) {
      try {
        const newAuthUrl = await proConnectAuthorizeUrl({
          req,
          force2FA: true,
          loginHint: e.loginHint,
          skipStateGeneration: true,
        });

        const url = new URL(newAuthUrl);
        url.searchParams.set(
          "state",
          url.searchParams.get("state")?.slice(0, 8) ?? "non renseigné"
        );
        url.searchParams.set(
          "nonce",
          url.searchParams.get("nonce")?.slice(0, 8) ?? "non renseigné"
        );
        url.searchParams.delete("login_hint");

        loggerContext.error("ProConnect2FANeeded", e.message, {
          "2FA.newAuthUrl": url.toString(),
        });

        return NextResponse.redirect(newAuthUrl);
      } catch (e: any) {
        loggerContext.error("ProConnectAuthorizeUrlError", e.message);
      }
    }

    loggerContext.error(
      e instanceof Error ? e.name : "Logger__Unknown",
      e instanceof Error ? e.message : "Logger__Unknown"
    );

    logFatalErrorInSentry(
      new AgentConnectionFailedException({
        cause: e,
        context: {
          slug:
            (loggerContext.getContextKey("siret") as string) ||
            "siret non renseigné",
        },
      })
    );
    if (e instanceof PrestataireException) {
      return NextResponse.redirect(
        getBaseUrl() + "/connexion/habilitation/prestataires"
      );
    }
    if (e instanceof CanRequestAuthorizationException) {
      return NextResponse.redirect(
        getBaseUrl() +
          `/connexion/habilitation/requise?siren=${e.context.siren}&name=${encodeURIComponent(e.context.details ?? "")}`
      );
    }
    if (e instanceof NeedASiretException) {
      logInfoInSentry(e);

      return NextResponse.redirect(
        getBaseUrl() + "/connexion/habilitation/administration-inconnue"
      );
    }
    if (e instanceof OrganisationNotAnAdministration) {
      return NextResponse.redirect(
        getBaseUrl() +
          `/connexion/habilitation/refusee?siren=${e.context.siren}&name=${encodeURIComponent(e.context.details ?? "")}`
      );
    }
    return NextResponse.redirect(getBaseUrl() + "/connexion/echec-connexion");
  }
});
