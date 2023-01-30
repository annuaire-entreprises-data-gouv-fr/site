import type { IronSessionOptions } from 'iron-session';
import env from '#env';

declare module 'iron-session' {
  interface IronSessionData extends ISession {}
}

export interface ISession {
  user?: { email?: string };
}

export const sessionOptions: IronSessionOptions = {
  password: env.IRON_SESSION_PWD as string,
  cookieName: 'annuaire-entreprises-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export const isLoggedIn = (session: ISession | null) => {
  return !!session?.user?.email;
};
