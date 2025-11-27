import { NextResponse } from "next/server";
import { proConnectAuthenticate } from "#clients/authentication/pro-connect/strategy";
import { AgentConnected } from "#models/authentication/agent/agent-connected";
import {
  AgentConnectionFailedException,
  CanRequestAuthorizationException,
  NeedASiretException,
  OrganisationNotAnAdministration,
  PrestataireException,
} from "#models/authentication/authentication-exceptions";
import { logFatalErrorInSentry, logInfoInSentry } from "#utils/sentry";
import { getBaseUrl } from "#utils/server-side-helper/get-base-url";
import { cleanPathFrom, getPathFrom, setAgentSession } from "#utils/session";
import withSession from "#utils/session/with-session";

export const GET = withSession(async function callbackRoute(req) {
  let siretForException = "" as string | undefined;
  try {
    const userInfo = await proConnectAuthenticate(req);
    siretForException = userInfo.siret;

    const agent = new AgentConnected(userInfo);

    const agentInfo = await agent.getAndVerifyAgentInfo();

    const session = req.session;

    await setAgentSession(agentInfo, session);

    const pathFrom = decodeURIComponent(getPathFrom(session) || "");

    let path = "/";
    if (pathFrom) {
      await cleanPathFrom(session);
      path = pathFrom;
    }

    const response = NextResponse.redirect(getBaseUrl() + path);
    response.cookies.set("user-was-logged-in", "true", {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return response;
  } catch (e: any) {
    logFatalErrorInSentry(
      new AgentConnectionFailedException({
        cause: e,
        context: { slug: siretForException || "siret non renseigné" },
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
