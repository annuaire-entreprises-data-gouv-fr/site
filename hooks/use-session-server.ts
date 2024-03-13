import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { ISession, sessionOptions } from '#utils/session';

export default async function useSessionServer(): Promise<ISession> {
  return await getIronSession<ISession>(cookies(), sessionOptions);
}
