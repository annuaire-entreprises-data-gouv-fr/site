import { IncomingMessage, ServerResponse } from 'http';
import { getCookie, setCookie } from '../cookies';
import { decrypt, encrypt } from '../crypto';

const CAPTCHA_COOKIE_NAME = 'annuaire-captcha';

/**
 * Verify the presence and the validity of the captcha cookie.
 *
 * @param req
 * @param res
 * @returns
 */
export const isCaptchaCookieValid = (
  req: IncomingMessage,
  res: ServerResponse
) => {
  if (
    !process.env.CAPTCHA_COOKIE_SECRET_KEY ||
    !process.env.CAPTCHA_SERVER_KEY ||
    !process.env.CAPTCHA_SITE_KEY
  ) {
    return true;
  }

  try {
    const cookie = getCookie(req, res, CAPTCHA_COOKIE_NAME);
    const timestampAsString = decrypt(cookie);
    const cookieCreationTimestamp = parseInt(timestampAsString, 10);
    const cookieIsOutdated = isTooOld(cookieCreationTimestamp);

    if (cookieIsOutdated) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Set a captcha cookie that is a timestamp of the time the user went through captcha verification
 * @param req
 * @param res
 */
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
  return elapsedMinutes > 90;
};
