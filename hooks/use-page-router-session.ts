/**
 * NO 'use client' as this uses a context and therefore cannot be used on server components
 */

import { createContext, useContext } from "react";
import type { ISession } from "#models/authentication/user/session";

const sessionContext = createContext<ISession | null>(null);

/**
 * DO NOT USE ON APP router
 * @returns
 */
export default function usePageRouterSession(): ISession | null {
  return useContext(sessionContext);
}

export const SessionProvider = sessionContext.Provider;
