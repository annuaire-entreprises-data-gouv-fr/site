import passport from 'passport';
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../utils/session';
import '../../../clients/france-connect/strategy';

export const PassportHandler = () =>
  nextConnect<NextApiRequest, NextApiResponse>()
    .use(async (req, res, next) => {
      await getSession(req, res); // session is set to req.session
      next();
    })
    .use(passport.initialize())
    .use(passport.session());
