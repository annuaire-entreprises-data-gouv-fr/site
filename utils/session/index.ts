import type { IronSession, SessionOptions } from 'iron-session';
import { IRights } from '#models/user/rights';
import { ISession } from '#models/user/session';

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
  siret: string,
  rights: IRights,
  userType: string,
  session: IronSession<ISession>
) => {
  session.user = {
    email,
    firstName,
    familyName,
    fullName: familyName ? `${firstName} ${familyName}` : undefined,
    siret,
    userType,
  };
  session.rights = rights;
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
