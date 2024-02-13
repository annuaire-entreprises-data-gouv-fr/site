import { IncomingMessage, ServerResponse } from 'http';
import Cookies from 'cookies';

export const getCookie = (
  req: IncomingMessage,
  res: ServerResponse,
  cookieName: string
) => {
  const cookies = new Cookies(req, res);
  return cookies.get(cookieName) || '';
};

export const setCookie = (
  req: IncomingMessage,
  res: ServerResponse,
  cookieName: string,
  value: string
) => {
  const cookies = new Cookies(req, res);
  cookies.set(cookieName, value);
};
