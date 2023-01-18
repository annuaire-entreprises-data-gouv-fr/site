import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import passport from 'passport';
import { sessionOptions } from '#utils/session';
import '../../../clients/auth/mon-compte-pro/strategy';

export default withIronSessionApiRoute(
  nextConnect<NextApiRequest, NextApiResponse>()
    .use(passport.initialize())
    .use(passport.session())
    .get((req, res, next) => {
      console.log(req.session);
      passport.authenticate('franceConnect', {
        failureRedirect: '/connexion/echec-connexion',
        successRedirect: '/api/auth/verify',
      });
    }),
  sessionOptions
);
