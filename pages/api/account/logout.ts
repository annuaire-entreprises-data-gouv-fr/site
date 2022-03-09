import { PassportHandler } from '.';
import { getSession } from '../../../utils/session';

export default PassportHandler().get(async (req, res, next) => {
  // clean session
  const session = await getSession(req, res);
  delete session.passport.companies;
  session.commit();
  //@ts-ignore
  req.logout();

  // redirect to referrer
  //  const redirect =(req.headers.referrer || req.headers.referer || '').toString() ||
  // '/compte/deconnexion';

  res.redirect('/compte/deconnexion');
});
