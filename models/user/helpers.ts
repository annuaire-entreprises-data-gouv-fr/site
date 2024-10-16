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

export function getAgentDisplayName(session: ISession | null) {
  return (
    session?.user?.fullName || session?.user?.email || 'Utilisateur inconnu'
  );
}
