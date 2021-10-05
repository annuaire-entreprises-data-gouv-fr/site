import { IncomingMessage, ServerResponse } from 'http';
import redirect from '../redirects';
import { getCookie, cleanCookie, setCookie } from '../cookies';
import { decrypt, encrypt } from '../crypto';

const CAPTCHA_COOKIE_NAME = 'annuaire-captcha';

export const protectWithCaptcha = (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const isCaptcahCookieValid = isCaptchaCookieValid(req, res);
  if (!isCaptcahCookieValid) {
    redirect(res, `/captcha?url=${req.url}`);
  }
};

export const isCaptchaCookieValid = (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    const cookie = getCookie(req, res, CAPTCHA_COOKIE_NAME);
    const timestampAsString = decrypt(cookie);
    const cookieCreationTimestamp = parseInt(timestampAsString, 10);
    const cookieIsOutdated = isTooOld(cookieCreationTimestamp);

    if (cookieIsOutdated) {
      throw new Error('Cookie is outdated');
    }

    return true;
  } catch (e) {
    console.log(e);
    cleanCookie(req, res, CAPTCHA_COOKIE_NAME);
    return false;
  }
};

export const setCaptchaCookie = (req: IncomingMessage, res: ServerResponse) => {
  const crypted = encrypt(getTimestamp().toString());
  setCookie(req, res, CAPTCHA_COOKIE_NAME, crypted);
};

const getTimestamp = () => {
  const d = new Date();
  return d.getTime();
};

const isTooOld = (timestamp: number) => {
  const timeDiff = getTimestamp() - timestamp;
  const elapsedMinutes = Math.floor(timeDiff / (1000 * 60));
  return elapsedMinutes > 10;
};
