import CryptoJS from 'crypto-js';

const secretKey = process.env.CAPTCHA_COOKIE_SECRET_KEY as string;

export const encrypt = (text: string) =>
  CryptoJS.AES.encrypt(text, secretKey).toString();

export const decrypt = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
