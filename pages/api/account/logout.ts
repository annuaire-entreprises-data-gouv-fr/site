import { PassportHandler } from '.';
import { getSession } from '../../../utils/session';

export default PassportHandler().get((req, res, next) => {
  //@ts-ignore
  req.logout();
  res.redirect('/compte/deconnexion');
});
