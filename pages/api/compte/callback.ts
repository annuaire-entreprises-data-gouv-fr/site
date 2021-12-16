import passport from 'passport';
import { PassportHandler } from '.';

export default PassportHandler().get(
  passport.authenticate('franceConnect', {
    failureRedirect: '/500',
    successRedirect: '/compte/mes-entreprises',
  })
);
