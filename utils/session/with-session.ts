import { ISession } from "#models/authentication/user/session";
import { IronSession, getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { sessionOptions } from ".";

export type IReqWithSession = NextRequest & {
  session: IronSession<ISession>;
};

export default function withSession<T>(
  handler: (req: IReqWithSession, context: T) => Promise<Response>
) {
  return async (req: NextRequest, context: T) => {
    const reqWithSession = req as IReqWithSession;
    const cookieStore = await cookies();
    reqWithSession.session = await getIronSession<ISession>(
      cookieStore,
      sessionOptions
    );
    return handler(reqWithSession, context);
  };
}
