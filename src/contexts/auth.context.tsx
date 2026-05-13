import { createContext, type ReactNode, useContext, useMemo } from "react";
import type { IAgentInfo } from "#/models/authentication/agent";
import type { ISession } from "#/models/authentication/user/session";

interface AuthContextType {
  user: IAgentInfo | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: ISession["user"] | null;
}) {
  const value = useMemo(() => ({ user }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
