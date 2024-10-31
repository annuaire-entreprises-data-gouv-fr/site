import { ISession } from '#models/user/session';
import { IronSession, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { sessionOptions } from '.';

export type IReqWithSession = NextRequest & {
  session: IronSession<ISession>;
};
export default function withSession(
  handler: (req: IReqWithSession, res: NextResponse) => Promise<any>
) {
  return async (req: NextRequest, res: NextResponse) => {
    const reqWithSession = req as IReqWithSession;
    reqWithSession.session = await getIronSession<ISession>(
      cookies(),
      sessionOptions
    );
    return handler(reqWithSession, res);
  };
}
