import { agentConnectLogoutUrl } from '#clients/auth/agent-connect/strategy';
import { Exception } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { setPathFrom } from '#utils/session';
import withSession from '#utils/session/with-session';

export default withSession(async function logoutRoute(req, res) {
  try {
    await setPathFrom(req.session, (req?.query?.pathFrom || '') as string);
    const url = await agentConnectLogoutUrl(req);
    res.redirect(url);
  } catch (e: any) {
    logErrorInSentry(new LogoutFailedException({ cause: e }));
    res.redirect('/connexion/au-revoir');
  }
});

export class LogoutFailedException extends Exception {
  constructor(args: { cause?: any }) {
    super({
      ...args,
      name: 'LogoutFailedException',
    });
  }
}
