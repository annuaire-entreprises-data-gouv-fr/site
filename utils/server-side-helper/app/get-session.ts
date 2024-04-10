import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { ISession } from '#models/user/session';
import { sessionOptions } from '#utils/session';

export default async function getSession(): Promise<ISession | null> {
  return await getIronSession<ISession>(cookies(), sessionOptions);
}
