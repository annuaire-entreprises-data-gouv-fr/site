import { IRefreshToken, ISession } from '#models/user/session';
import { IronSession, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { refreshTokenOptions, sessionOptions } from '.';

export type IReqWithSession = NextRequest & {
  session: IronSession<ISession>;
  refreshToken: IronSession<IRefreshToken>;
};
export default function withSessionAndRefreshToken(
  handler: (req: IReqWithSession) => Promise<any>
) {
  return async (req: NextRequest) => {
    const reqWithSession = req as IReqWithSession;
    const cookieStore = await cookies();
    reqWithSession.session = await getIronSession<ISession>(
      cookieStore,
      sessionOptions
    );
    reqWithSession.refreshToken = await getIronSession<IRefreshToken>(
      cookieStore,
      refreshTokenOptions
    );
    return handler(reqWithSession);
  };
}
