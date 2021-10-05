import { NextApiRequest, NextApiResponse } from 'next';
import httpClient from '../../../utils/network/http';
import redirect, { redirectForbidden } from '../../../utils/redirects';
import logErrorInSentry from '../../../utils/sentry';
import { setCaptchaCookie } from '../../../utils/captcha';

const verify = async (req: NextApiRequest, res: NextApiResponse) => {
  const path = decodeURI(req.query.url as string);
  const code = req.query['g-recaptcha-response'];
  try {
    const verify = await httpClient({
      url: `https://www.google.com/recaptcha/api/siteverify?response=${code}&secret=${process.env.CAPTCHA_SERVER_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (verify.data.success) {
      setCaptchaCookie(req, res);
      redirect(res, path);
    } else {
      const reason = verify.data['error-codes'].join('.');
      logErrorInSentry(reason, { page: path });
      redirectForbidden(res, 'Blocked by reCaptcha');
    }
  } catch (e) {
    setCaptchaCookie(req, res);
    logErrorInSentry(e, { page: path });
    redirect(res, path);
  }
  res.end();
};

export default verify;
