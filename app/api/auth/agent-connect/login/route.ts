import { NextResponse } from "next/server";
import { proConnectAuthorizeUrl } from "#clients/authentication/pro-connect/strategy";
import { AgentConnectionFailedException } from "#models/authentication/authentication-exceptions";
import { logFatalErrorInSentry } from "#utils/sentry";
import { getBaseUrl } from "#utils/server-side-helper/get-base-url";
import { setPathFrom } from "#utils/session";
import withSession from "#utils/session/with-session";

export const GET = withSession(async function loginRoute(req) {
  try {
    if (req.session.franceConnectHidePersonalDataSession) {
      throw new Error("User is already logged in with FranceConnect");
    }

    const referer = req.headers.get("referer") || "";
    const baseURL = getBaseUrl();
    const isFromSite = referer.indexOf(baseURL) === 0;

    const pathFrom =
      req.nextUrl.searchParams.get("pathFrom") ||
      (isFromSite && new URL(referer).pathname) ||
      "";

    await setPathFrom(req.session, pathFrom);
    const url = await proConnectAuthorizeUrl(req);
    return NextResponse.redirect(url);
  } catch (e: any) {
    logFatalErrorInSentry(new AgentConnectionFailedException({ cause: e }));
    return NextResponse.redirect(getBaseUrl() + "/connexion/echec-connexion");
  }
});
