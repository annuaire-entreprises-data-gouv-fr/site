import passport from 'passport';
import { PassportHandler } from '.';

export default PassportHandler().get(
  passport.authenticate('franceConnect', {
    failureRedirect: '/compte/echec-connexion',
    successRedirect: '/api/account/verify',
  })
);
