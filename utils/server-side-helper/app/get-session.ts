import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import type { ISession } from "#models/authentication/user/session";
import { sessionOptions } from "#utils/session";

export default async function getSession(): Promise<ISession | null> {
  const cookieStore = await cookies();
  const ironSession = await getIronSession<ISession>(
    cookieStore,
    sessionOptions
  );
  return { ...ironSession };
}
