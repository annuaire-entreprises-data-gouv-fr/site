/** biome-ignore-all lint/correctness/useHookAtTopLevel: not a hook */

import { createServerOnlyFn } from "@tanstack/react-start";
import { getCookie, getRequest, setCookie } from "@tanstack/react-start/server";
import { getIronSession } from "iron-session";
import type { IAgentInfo } from "#/models/authentication/agent";
import type { ISession } from "#/models/authentication/user/session";
import { isAbsoluteUrl } from "#/utils/server-side-helper/is-absolute-url";

const COOKIE_NAME = "annuaire-entreprises-user-session-7";
const MAX_AGE = 43_200;

interface StoredSession {
  createdAt: number;
  data: Partial<ISession>;
}

async function useAppSession() {
  const password = process.env.SESSION_PWD;
  if (!password) {
    throw new Error("SESSION_PWD is not set");
  }

  const cookieOptions = {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
  };
  const options = {
    password,
    cookieName: COOKIE_NAME,
    cookieOptions,
    ttl: MAX_AGE,
    chunk: true,
  };
  const writtenCookies = new Map<string, string | undefined>();
  const session = await getIronSession<StoredSession>(
    {
      read: (name) => {
        if (writtenCookies.has(name)) {
          return writtenCookies.get(name);
        }
        return getCookie(name);
      },
      write: (name, value, attributes) => {
        writtenCookies.set(name, attributes.maxAge === 0 ? undefined : value);
        setCookie(name, value, attributes);
      },
    },
    options
  );
  const isNew =
    !(session.createdAt && session.data) ||
    Date.now() - session.createdAt > MAX_AGE * 1000;
  if (isNew) {
    Object.assign(session, {
      createdAt: Date.now(),
      data: {},
    });
  }

  // Keep the 12-hour session lifetime fixed across updates.
  const expires = new Date((session.createdAt as number) + MAX_AGE * 1000);
  const maxAge = Math.ceil((expires.getTime() - Date.now()) / 1000);
  session.updateConfig({
    ...options,
    ttl: maxAge,
    cookieOptions: { ...cookieOptions, expires, maxAge },
  });
  if (isNew) {
    await session.save();
  }

  const manager = {
    get data() {
      return session.data ?? {};
    },
    update: async (update: Partial<ISession>) => {
      session.data ??= {};
      Object.assign(session.data, update);
      await session.save();
      return manager;
    },
    clear: async () => {
      session.destroy();
      return manager;
    },
  };
  return manager;
}

type Session = Awaited<ReturnType<typeof useAppSession>>;
const sessions = new WeakMap<Request, Promise<Session>>();

export const getCurrentSession = createServerOnlyFn(() => {
  const request = getRequest();
  let session = sessions.get(request);
  if (!session) {
    session = useAppSession();
    sessions.set(request, session);
  }
  return session;
});

/**
 * Utils for AgentConnect session
 */

export const setAgentSession = createServerOnlyFn(
  async (agent: IAgentInfo, session: Session) => {
    await session.update({
      user: agent,
    });
  }
);

export const cleanAgentSession = createServerOnlyFn(
  async (session: Session) => {
    await session.update({
      state: undefined,
      nonce: undefined,
      proConnectTokenSet: undefined,
      user: null,
    });
  }
);

export const cleanFranceConnectSession = createServerOnlyFn(
  async (session: Session) => {
    await session.update({
      franceConnectHidePersonalDataSession: undefined,
    });
  }
);

export const setStateAndNonce = createServerOnlyFn(
  async (
    session: Session,
    state: string | undefined,
    nonce: string | undefined
  ) => {
    await session.update({
      state,
      nonce,
    });
  }
);

export const setProConnectTokenSet = createServerOnlyFn(
  async (
    session: Session,
    proConnectTokenSet: ISession["proConnectTokenSet"]
  ) => {
    await session.update({
      proConnectTokenSet,
      state: undefined,
      nonce: undefined,
    });
  }
);

/**
 * Utils for AgentConnect redirection
 */

export const setPathFrom = createServerOnlyFn(
  async (session: Session, pathFrom: string) => {
    if (pathFrom) {
      if (isAbsoluteUrl(pathFrom)) {
        throw new Error("Absolute URL not allowed");
      }
      await session.update({
        pathFrom,
      });
    }
  }
);

export const getPathFrom = createServerOnlyFn(
  (session: Session) => session.data.pathFrom
);

export const cleanPathFrom = createServerOnlyFn(async (session: Session) => {
  await session.update({
    pathFrom: undefined,
  });
});

/**
 * Utils for FranceConnect session
 */

export const setHidePersonalDataRequestFCSession = createServerOnlyFn(
  async (
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
  }
);

export const getHidePersonalDataRequestFCSession = createServerOnlyFn(
  (
    session: Partial<ISession> | null
  ): Required<
    NonNullable<ISession["franceConnectHidePersonalDataSession"]>
  > | null => {
    if (
      !(
        session?.franceConnectHidePersonalDataSession?.firstName &&
        session.franceConnectHidePersonalDataSession.familyName &&
        session.franceConnectHidePersonalDataSession.birthdate
      )
    ) {
      return null;
    }
    return session.franceConnectHidePersonalDataSession as Required<
      NonNullable<ISession["franceConnectHidePersonalDataSession"]>
    >;
  }
);
