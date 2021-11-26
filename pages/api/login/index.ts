import passport from 'passport';
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../utils/session';
import '../../../clients/france-connect/strategy';

export default nextConnect()
  .use(async (req: NextApiRequest, res: NextApiResponse, next) => {
    await getSession(req, res); // session is set to req.session
    next();
  })
  .use(passport.initialize())
  .use(passport.session())
  .post(passport.authenticate('franceConnect'))
  .get(
    passport.authenticate('franceConnect', {
      failureRedirect: '/500',
      successRedirect: '/parcours-client',
    })
  );
