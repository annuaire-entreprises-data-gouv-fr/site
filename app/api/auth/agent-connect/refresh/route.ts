import { logFatalErrorInSentry } from '#utils/sentry';
import { setAgentSession } from '#utils/session';
import withSessionAndRefreshToken from '#utils/session/with-session-and-refresh-token';
import { NextResponse } from 'next/server';

export const GET = withSessionAndRefreshToken(async function callbackRoute(
  req
) {
  try {
    const refreshToken = req.refreshToken;
    const agent = refreshToken.user;

    if (!refreshToken || !agent) {
      return new NextResponse(
        JSON.stringify({ error: 'Refresh token is missing' }),
        { status: 401 }
      );
    }

    const session = req.session;
    await setAgentSession(agent, session);

    return new NextResponse(
      JSON.stringify({ message: 'Session successfully refreshed' }),
      { status: 200 }
    );
  } catch (e: any) {
    logFatalErrorInSentry(e);
    return new NextResponse(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500 }
    );
  }
});
