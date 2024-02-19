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

  // FranceConnect hide personal data request
  hidePersonalDataRequestFC?: {
    firstName?: string;
    familyName?: string;
    birthdate?: string;
    tokenId: string;
    sub: string;
  };
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
  if (pathFrom) {
    session.pathFrom = pathFrom;
    await session.save();
  }
};

export const getPathFrom = (session: IronSession<ISession>) => session.pathFrom;

export const cleanPathFrom = async (session: IronSession<ISession>) => {
  delete session.pathFrom;
};
export const setHidePersonalDataRequestFCSession = async (
  firstName: string | undefined,
  familyName: string | undefined,
  birthdate: string | undefined,
  tokenId: string,
  sub: string,
  session: IronSession<ISession>
) => {
  session.hidePersonalDataRequestFC = {
    firstName,
    familyName,
    birthdate,
    tokenId,
    sub,
  };
  await session.save();
};

export function getHidePersonalDataRequestFCSession(
  session: ISession | null
): Required<NonNullable<ISession['hidePersonalDataRequestFC']>> | null {
  if (
    !session ||
    !session.hidePersonalDataRequestFC ||
    !session.hidePersonalDataRequestFC.firstName ||
    !session.hidePersonalDataRequestFC.familyName ||
    !session.hidePersonalDataRequestFC.birthdate
  ) {
    return null;
  }
  return session.hidePersonalDataRequestFC as Required<
    NonNullable<ISession['hidePersonalDataRequestFC']>
  >;
}

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
