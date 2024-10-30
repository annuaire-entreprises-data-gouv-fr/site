/**
 * NO 'use client' as this uses a context and therefore cannot be used on server components
 */

import { ISession } from '#models/user/session';
import { createContext, useContext } from 'react';

const sessionContext = createContext<ISession | null>(null);

/**
 * DO NOT USE ON APP router
 * @returns
 */
export default function usePageRouterSession(): ISession | null {
  return useContext(sessionContext);
}

export const SessionProvider = sessionContext.Provider;
