import { IncomingMessage, ServerResponse } from 'http';
import redirect from '.';
import { verifyCaptchaCookie } from '../captcha-cookies';

export const protectWithCaptcha = (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const isCaptcahCookieValid = verifyCaptchaCookie(req, res);
  if (!isCaptcahCookieValid) {
    redirect(res, `/captcha?url=${req.url}`);
  }
};
