import type { ISession } from "#/models/authentication/user/session";
import { getCurrentSession } from "#/utils/session/index.server";

export default async function getSession(): Promise<ISession | null> {
  const session = await getCurrentSession();

  return session?.data as ISession | null;
}
