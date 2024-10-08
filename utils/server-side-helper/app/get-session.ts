import { ISession } from '#models/user/session';
import { sessionOptions } from '#utils/session';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export default async function getSession(): Promise<ISession | null> {
  const ironSession = await getIronSession<ISession>(cookies(), sessionOptions);
  return { ...ironSession };
}
