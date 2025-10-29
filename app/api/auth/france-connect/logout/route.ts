import { NextResponse } from "next/server";
import { franceConnectLogoutUrl } from "#clients/authentication/france-connect/strategy";
import logErrorInSentry from "#utils/sentry";
import { getBaseUrl } from "#utils/server-side-helper/get-base-url";
import { setPathFrom } from "#utils/session";
import withSession from "#utils/session/with-session";
import { FranceConnectLogoutFailedException } from "../france-connect-types";

export const GET = withSession(async function logoutRoute(req) {
  try {
    await setPathFrom(
      req.session,
      (req.nextUrl.searchParams.get("pathFrom") || "") as string
    );
    const url = await franceConnectLogoutUrl(req);
    return NextResponse.redirect(url);
  } catch (e: any) {
    logErrorInSentry(new FranceConnectLogoutFailedException({ cause: e }));
    return NextResponse.redirect(getBaseUrl() + "/connexion/au-revoir");
  }
});
