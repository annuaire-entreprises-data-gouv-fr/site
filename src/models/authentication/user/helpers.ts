import type { ISession } from "./session";

export function getAgentEmail(session: Partial<ISession> | null) {
  return session?.user?.email || "";
}

export function getAgentUserType(session: Partial<ISession> | null) {
  return session?.user?.userType || "";
}

export function getIAgentScope(session: Partial<ISession> | null) {
  return session?.user?.scopes || [];
}

export function getAgentFullName(session: Partial<ISession> | null) {
  const fullName = session?.user?.fullName;
  const firstName = session?.user?.firstName;
  const familyName = session?.user?.familyName;

  if (fullName) {
    return fullName.trim();
  }

  return [firstName, familyName].filter(Boolean).join(" ").trim();
}

export function getAgentDisplayName(session: Partial<ISession> | null) {
  return (
    session?.user?.fullName || session?.user?.email || "Utilisateur inconnu"
  );
}
