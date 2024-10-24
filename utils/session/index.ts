import { IAgentInfo } from '#models/user/agent';
import { ISession } from '#models/user/session';
import { isAbsoluteUrl } from '#utils/server-side-helper/app/is-absolute-url';
import type { IronSession, SessionOptions } from 'iron-session';

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
  await session.save();
}

/**
 * Utils for AgentConnect session
 */

export const setAgentSession = async (
  agent: IAgentInfo,
  session: IronSession<ISession>
) => {
  session.user = agent;
  await session.save();
};

export const cleanAgentSession = async (session: IronSession<ISession>) => {
  session.destroy();
  await session.save();
};

/**
 * Utils for AgentConnect redirection
 */

export const setPathFrom = async (
  session: IronSession<ISession>,
  pathFrom: string
) => {
  if (pathFrom && !isAbsoluteUrl(pathFrom)) {
    session.pathFrom = pathFrom;
    await session.save();
  }
};

export const getPathFrom = (session: IronSession<ISession>) => session.pathFrom;

export const cleanPathFrom = async (session: IronSession<ISession>) => {
  delete session.pathFrom;
  await session.save();
};

/**
 * Utils for FranceConnect session
 */

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
