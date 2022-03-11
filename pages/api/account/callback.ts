import passport from 'passport';
import { PassportHandler } from '.';

export default PassportHandler().get(
  passport.authenticate('franceConnect', {
    failureRedirect: '/connexion/echec-connexion',
    successRedirect: '/api/account/verify',
  })
);
