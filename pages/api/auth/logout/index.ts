import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { sessionOptions } from '#utils/session';
import '../../../clients/auth/mon-compte-pro/strategy';

export default withIronSessionApiRoute(
  nextConnect<NextApiRequest, NextApiResponse>().get(
    async (req, res, session) => {
      res.redirect(
        client.endSessionUrl({
          id_token_hint: session?.passport?.user?.id_token,
        })
      );
    }
  ),
  sessionOptions
);
