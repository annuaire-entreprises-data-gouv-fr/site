import { PassportHandler } from '.';

export default PassportHandler().get((req, res, next) => {
  //@ts-ignore
  req.logout();
  res.redirect('/compte/deconnexion');
});
