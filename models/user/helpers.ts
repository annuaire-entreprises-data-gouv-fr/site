import { IAgentContactInfo } from '#components/feedback-modal/type';
import { EScope, hasRights } from './rights';
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

export function getAgentScopes(session: ISession | null) {
  return session?.user?.scopes || [];
}

export function getAgentDisplayName(session: ISession | null) {
  return (
    session?.user?.fullName || session?.user?.email || 'Utilisateur inconnu'
  );
}

export function getAgentContactInfo(
  session: ISession | null
): IAgentContactInfo | null {
  const email = getAgentEmail(session);

  if (!hasRights(session, EScope.isAgent) || !email) {
    return null;
  }
  return {
    email,
    name: session?.user?.fullName || '',
  };
}

export function setAgentUseCase(session: ISession | null, useCase: string) {
  // if (session) {
  //   session?.user.useCase = useCase;
  //   await session.save();
  // } else {
  //   logWarningInSentry();
  // }
}
