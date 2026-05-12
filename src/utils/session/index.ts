import {
  getSession,
  type SessionConfig,
  updateSession,
} from "@tanstack/react-start/server";
import type { IAgentInfo } from "#/models/authentication/agent";
import type { ISession } from "#/models/authentication/user/session";
import { isAbsoluteUrl } from "#/utils/server-side-helper/is-absolute-url";

export const sessionOptions: SessionConfig = {
  password: process.env.IRON_SESSION_PWD as string,
  name: "annuaire-entreprises-user-session-6",
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true, // ✅ Critical for XSS protection
    sameSite: "lax", // ✅ CSRF protection
  },
  maxAge: 43_200, // 12h
};

export function getCurrentSession() {
  return getSession<ISession>(sessionOptions);
}

type Session = Awaited<ReturnType<typeof getCurrentSession>>;

export async function setVisitTimestamp(session: Session) {
  await updateSession<ISession>(sessionOptions, {
    ...session.data,
    lastVisitTimestamp: Date.now(),
  });
}

/**
 * Utils for AgentConnect session
 */

export const setAgentSession = async (agent: IAgentInfo, session: Session) => {
  await updateSession<ISession>(sessionOptions, {
    ...session.data,
    user: agent,
  });
};

export const cleanAgentSession = async (session: Session) => {
  await updateSession<ISession>(sessionOptions, {
    ...session.data,
    state: undefined,
    nonce: undefined,
    proConnectTokenSet: undefined,
    user: null,
  });
};

export const cleanFranceConnectSession = async (session: Session) => {
  await updateSession<ISession>(sessionOptions, {
    ...session.data,
    franceConnectHidePersonalDataSession: undefined,
  });
};

export const setStateAndNonce = async (
  session: Session,
  state: string | undefined,
  nonce: string | undefined
) => {
  await updateSession<ISession>(sessionOptions, {
    ...session.data,
    state,
    nonce,
  });
};

export const setProConnectTokenSet = async (
  session: Session,
  proConnectTokenSet: ISession["proConnectTokenSet"]
) => {
  await updateSession<ISession>(sessionOptions, {
    ...session.data,
    proConnectTokenSet,
    state: undefined,
    nonce: undefined,
  });
};

/**
 * Utils for AgentConnect redirection
 */

export const setPathFrom = async (session: Session, pathFrom: string) => {
  if (pathFrom) {
    if (isAbsoluteUrl(pathFrom)) {
      throw new Error("Absolute URL not allowed");
    }
    await updateSession<ISession>(sessionOptions, {
      ...session.data,
      pathFrom,
    });
  }
};

export const getPathFrom = (session: Session) => session.data.pathFrom;

export const cleanPathFrom = async (session: Session) => {
  await updateSession<ISession>(sessionOptions, {
    ...session.data,
    pathFrom: undefined,
  });
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
  session: Session
) => {
  await updateSession<ISession>(sessionOptions, {
    ...session.data,
    franceConnectHidePersonalDataSession: {
      firstName,
      familyName,
      birthdate,
      tokenId,
      sub,
    },
  });
};

export function getHidePersonalDataRequestFCSession(
  session: ISession | null
): Required<
  NonNullable<ISession["franceConnectHidePersonalDataSession"]>
> | null {
  if (
    !session?.franceConnectHidePersonalDataSession?.firstName ||
    !session.franceConnectHidePersonalDataSession.familyName ||
    !session.franceConnectHidePersonalDataSession.birthdate
  ) {
    return null;
  }
  return session.franceConnectHidePersonalDataSession as Required<
    NonNullable<ISession["franceConnectHidePersonalDataSession"]>
  >;
}
