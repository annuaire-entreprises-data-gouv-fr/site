/** biome-ignore-all lint/correctness/useHookAtTopLevel: not a hook */
import { useSession } from "@tanstack/react-start/server";
import type { IAgentInfo } from "#/models/authentication/agent";
import type { ISession } from "#/models/authentication/user/session";
import { isAbsoluteUrl } from "#/utils/server-side-helper/is-absolute-url";

function useAppSession() {
  return useSession<ISession>({
    password: process.env.IRON_SESSION_PWD as string,
    name: "annuaire-entreprises-user-session-6",
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true, // ✅ Critical for XSS protection
      sameSite: "lax", // ✅ CSRF protection
    },
    maxAge: 43_200, // 12h
  });
}

export function getCurrentSession() {
  return useAppSession();
}

type Session = Awaited<ReturnType<typeof getCurrentSession>>;

/**
 * Utils for AgentConnect session
 */

export const setAgentSession = async (agent: IAgentInfo, session: Session) => {
  await session.update({
    user: agent,
  });
};

export const cleanAgentSession = async (session: Session) => {
  await session.update({
    state: undefined,
    nonce: undefined,
    proConnectTokenSet: undefined,
    user: null,
  });
};

export const cleanFranceConnectSession = async (session: Session) => {
  await session.update({
    franceConnectHidePersonalDataSession: undefined,
  });
};

export const setStateAndNonce = async (
  session: Session,
  state: string | undefined,
  nonce: string | undefined
) => {
  await session.update({
    state,
    nonce,
  });
};

export const setProConnectTokenSet = async (
  session: Session,
  proConnectTokenSet: ISession["proConnectTokenSet"]
) => {
  await session.update({
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
    await session.update({
      pathFrom,
    });
  }
};

export const getPathFrom = (session: Session) => session.data.pathFrom;

export const cleanPathFrom = async (session: Session) => {
  await session.update({
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
  await session.update({
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
  session: Partial<ISession> | null
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
