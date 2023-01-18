import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import passport from 'passport';
import { sessionOptions } from '#utils/session';

export default withIronSessionApiRoute(
  nextConnect<NextApiRequest, NextApiResponse>()
    .use(passport.initialize())
    .use(passport.session())
    .get(async (req, res, session) => {
      // clean session
      delete session.passport.companies;
      session.commit();
      //@ts-ignore
      req.logout();

      // redirect to referrer
      //  const redirect =(req.headers.referrer || req.headers.referer || '').toString() ||
      // '/connexion/au-revoir';

      res.redirect('/connexion/au-revoir');
    }),
  sessionOptions
);
