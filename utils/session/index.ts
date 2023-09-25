import { randomUUID } from 'crypto';
import type { IronSession, IronSessionOptions } from 'iron-session';

declare module 'iron-session' {
  interface IronSessionData extends ISession {}
}

export type ISessionPrivilege = 'unkown' | 'agent' | 'super-agent';

export type ISession = {
  uuid?: string;
  user?: {
    email?: string;
    familyName?: string;
    firstName?: string;
    fullName?: string;
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

export async function identifySession(session: IronSession) {
  if (!hasSessionId(session)) {
    session.uuid = randomUUID();
    return session.save();
  }
}

export const setAgentSession = async (
  email: string,
  familyName: string,
  firstName: string,
  privilege: ISessionPrivilege,
  session: IronSession
) => {
  session.user = {
    email,
    firstName,
    familyName,
    fullName: familyName ? `${firstName} ${familyName}` : undefined,
    privilege,
  };
  await session.save();
};

/**
 * Verify if session has a uuid
 *
 * @param session
 * @returns
 */
export const hasSessionId = (session: ISession | null) => {
  return !!session?.uuid;
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
export const isBasicAgent = (session: ISession | null) => {
  return session?.user?.privilege === 'agent';
};

/**
 *  Verify if user session has super-agent privileges
 */
export const isSuperAgent = (session: ISession | null) => {
  return session?.user?.privilege === 'super-agent';
};

/**
 *  Verify if user session has super-agent or agent privileges
 */
export const isAgent = (session: ISession | null) => {
  return isBasicAgent(session) || isSuperAgent(session);
};
