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
  const fullname = session?.user?.fullName;
  const firstname = session?.user?.firstName;
  const lastname = session?.user?.familyName;

  if (fullname) {
    return fullname.trim();
  }

  return [firstname, lastname].filter(Boolean).join(' ').trim();
}

export function getAgentDisplayName(session: ISession | null) {
  return (
    session?.user?.fullName || session?.user?.email || 'Utilisateur inconnu'
  );
}
