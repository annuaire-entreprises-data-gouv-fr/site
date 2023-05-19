import type { IronSession, IronSessionOptions } from 'iron-session';

declare module 'iron-session' {
  interface IronSessionData extends ISession {}
}

export type ISessionPrivilege = 'unkown' | 'agent' | 'super-agent';

export type ISession = {
  user?: {
    email?: string;
    privilege?: ISessionPrivilege;
  };
};

export const sessionOptions: IronSessionOptions = {
  password: process.env.IRON_SESSION_PWD as string,
  cookieName: 'annuaire-entreprises-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export const setAgentSession = async (
  email: string,
  privilege: ISessionPrivilege,
  session: IronSession
) => {
  session.user = {
    email,
    privilege,
  };
  await session.save();
};

/**
 *  Verify if user is loggedin
 *
 * @param session
 * @returns
 */
export const isLoggedIn = (session: ISession | null) => {
  return !!session?.user?.email;
};

/**
 *  Verify if user session has agent privileges
 *
 * @param session
 * @returns
 */
export const isAgent = (session: ISession | null) => {
  return session?.user?.privilege === 'agent';
};

/**
 *  Verify if user session has super-agent privileges
 */
export const isSuperAgent = (session: ISession | null) => {
  return session?.user?.privilege === 'super-agent';
};
