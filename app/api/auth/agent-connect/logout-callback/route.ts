import { NextResponse } from "next/server";
import { AgentConnectionFailedException } from "#models/authentication/authentication-exceptions";
import logErrorInSentry from "#utils/sentry";
import { getBaseUrl } from "#utils/server-side-helper/get-base-url";
import { cleanAgentSession, cleanPathFrom, getPathFrom } from "#utils/session";
import withSession from "#utils/session/with-session";

export const GET = withSession(async function logoutCallbackRoute(req) {
  try {
    const session = req.session;
    const pathFrom = getPathFrom(session);
    await cleanAgentSession(session);

    let path = "/connexion/au-revoir";
    if (pathFrom) {
      await cleanPathFrom(session);
      path = pathFrom;
    }

    const response = NextResponse.redirect(getBaseUrl() + pathFrom);
    response.cookies.delete("user-was-logged-in");
    return response;
  } catch (e: any) {
    logErrorInSentry(new AgentConnectionFailedException({ cause: e }));
    return NextResponse.redirect(getBaseUrl() + "/connexion/au-revoir");
  }
});
