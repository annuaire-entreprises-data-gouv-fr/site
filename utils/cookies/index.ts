import Cookies from 'cookies';
import { IncomingMessage, ServerResponse } from 'http';

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
