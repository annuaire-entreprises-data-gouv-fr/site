import Cookies from 'cookies';
import { IncomingMessage, ServerResponse } from 'http';
import Crypto from 'crypto';

const algorithm = 'aes-256-ctr';
const secretKey = process.env.CAPTCHA_COOKIE_SECRET_KEY as string;
const iv = Crypto.randomBytes(16);
const cookieName = 'cptch';

const encrypt = (text: string) => {
  const cipher = Crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([
    cipher.update('CPTCH' + text),
    cipher.final(),
  ]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

const decrypt = (hash: any) => {
  const decipher = Crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hash.iv, 'hex')
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final(),
  ]);

  return decrpyted.toString();
};

export const verifyCaptchaCookie = (
  req: IncomingMessage,
  res: ServerResponse
) => {
  if (!process.env.CAPTCHA_COOKIE_SECRET_KEY) {
    return true;
  }

  try {
    const cookies = new Cookies(req, res);
    const captchaCookie = cookies.get(cookieName) || '';

    const captchaHash = JSON.parse(decodeURI(captchaCookie));
    const decrypted = decrypt(captchaHash);

    if (decrypted.indexOf('CPTCH') !== 0) {
      throw new Error('Not a valid content');
    }

    const timestamp = parseInt(decrypted.replace('CPTCH', ''), 10);
    const now = new Date();
    const timeDiff = now.getTime() - timestamp;
    const elapsedMinutes = Math.floor(timeDiff / (1000 * 60));

    if (elapsedMinutes > 10) {
      throw new Error('Cookie is outdated');
    }

    return true;
  } catch (e) {
    cleanCookie(req, res);
    return false;
  }
};

export const cleanCookie = (req: IncomingMessage, res: ServerResponse) => {
  const cookies = new Cookies(req, res);
  cookies.set(cookieName, '', { maxAge: 0 });
};

export const setCaptchaCookie = (req: IncomingMessage, res: ServerResponse) => {
  const cookies = new Cookies(req, res);
  const now = new Date();
  const crypted = encrypt(now.getTime().toString());
  cookies.set(cookieName, encodeURI(JSON.stringify(crypted)));
};
