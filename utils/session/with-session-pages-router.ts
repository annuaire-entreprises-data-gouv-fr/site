import { ISession } from '#models/user/session';
import { IronSession, getIronSession } from 'iron-session';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions } from '.';

type IReqWithSession = NextApiRequest & {
  session: IronSession<ISession>;
};

export default function withSessionPagesRouter(
  handler: (req: IReqWithSession, res: NextApiResponse) => Promise<any>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const reqWithSession = req as IReqWithSession;
    reqWithSession.session = await getIronSession<ISession>(
      req,
      res,
      sessionOptions
    );
    return handler(reqWithSession, res);
  };
}
