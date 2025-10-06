import type { IronSession, SessionOptions } from "iron-session";
import type { IAgentInfo } from "#models/authentication/agent";
import type { ISession } from "#models/authentication/user/session";
import { isAbsoluteUrl } from "#utils/server-side-helper/app/is-absolute-url";

export const sessionOptions: SessionOptions = {
  password: process.env.IRON_SESSION_PWD as string,
  cookieName: "annuaire-entreprises-user-session-4",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
  ttl: 43_200, // 12h
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
  if (pathFrom) {
    if (isAbsoluteUrl(pathFrom)) {
      throw new Error("Absolute URL not allowed");
    }
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
  session.franceConnectHidePersonalDataSession = {
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
): Required<
  NonNullable<ISession["franceConnectHidePersonalDataSession"]>
> | null {
  if (
    !session ||
    !session.franceConnectHidePersonalDataSession ||
    !session.franceConnectHidePersonalDataSession.firstName ||
    !session.franceConnectHidePersonalDataSession.familyName ||
    !session.franceConnectHidePersonalDataSession.birthdate
  ) {
    return null;
  }
  return session.franceConnectHidePersonalDataSession as Required<
    NonNullable<ISession["franceConnectHidePersonalDataSession"]>
  >;
}
