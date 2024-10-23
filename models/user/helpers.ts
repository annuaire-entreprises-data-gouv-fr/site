import { ISession } from './session';

export function getAgentEmail(session: ISession | null) {
  return session?.user?.email || '';
}

export function getAgentUserType(session: ISession | null) {
  return session?.user?.userType || '';
}

export function getAgentLabel(session: ISession | null) {
  return session?.user?.isPrestataire ? 'externe' : 'agent public';
}

export function getIAgentScope(session: ISession | null) {
  return session?.user?.scopes || [];
}

export function getAgentFullName(session: ISession | null) {
  const fullName = session?.user?.fullName;
  const firstName = session?.user?.firstName;
  const familyName = session?.user?.familyName;

  if (fullName) {
    return fullName.trim();
  }

  return [firstName, familyName].filter(Boolean).join(' ').trim();
}

export function getAgentDisplayName(session: ISession | null) {
  return (
    session?.user?.fullName || session?.user?.email || 'Utilisateur inconnu'
  );
}
