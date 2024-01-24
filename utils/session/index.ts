import type { IronSession, SessionOptions } from 'iron-session';

export type ISessionPrivilege = 'unkown' | 'agent' | 'super-agent';

export type ISession = {
  lastVisitTimestamp?: number;
  user?: {
    email?: string;
    familyName?: string;
    firstName?: string;
    fullName?: string;
    privilege?: ISessionPrivilege;
  };
  // agent connect
  state?: string;
  nonce?: string;
  idToken?: string;
  // connexion
  pathFrom?: string;
};

export const sessionOptions: SessionOptions = {
  password: process.env.IRON_SESSION_PWD as string,
  cookieName: 'annuaire-entreprises-user-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
  ttl: 604800, // a week
};

export async function setVisitTimestamp(session: IronSession<ISession>) {
  session.lastVisitTimestamp = new Date().getTime();
  return session.save();
}

export const setAgentSession = async (
  email: string,
  familyName: string,
  firstName: string,
  privilege: ISessionPrivilege,
  session: IronSession<ISession>
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

export const cleanAgentSession = async (session: IronSession<ISession>) => {
  session.user = {};
  await session.save();
};

/**
 * Store Siren for redirections
 * @param session
 */

export const setPathFrom = async (
  session: IronSession<ISession>,
  pathFrom: string
) => {
  session.pathFrom = pathFrom;
  await session.save();
};

export const getPathFrom = (session: IronSession<ISession>) => session.pathFrom;

export const cleanPathFrom = async (session: IronSession<ISession>) => {
  delete session.pathFrom;
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
