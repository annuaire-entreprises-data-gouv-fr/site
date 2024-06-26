'use client';

import { createContext, useContext } from 'react';
import { ISession } from '#models/user/session';

const sessionContext = createContext<ISession | null>(null);

export default function useSession(): ISession | null {
  return useContext(sessionContext);
}

export const SessionProvider = sessionContext.Provider;
