import { IAgentContactInfo } from '#components/feedback-modal/type';
import { InternalError } from '#models/exceptions';
import { UseCase } from './agent';
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

export function setAgentUseCase<S extends ISession>(
  UseCase: UseCase,
  session: S
): S {
  if (!session || !session.user) {
    throw new InternalError({
      message: 'Failed to set use case',
      cause: new Error('User not found in session'),
    });
  }
  session.user.useCase = UseCase;
  return session;
}

export function resetAgentUseCase<S extends ISession>(session: S): S {
  if (!session || !session.user) {
    throw new InternalError({
      message: 'Failed to set use case',
      cause: new Error('User not found in session'),
    });
  }
  delete session.user.useCase;
  return session;
}

export function agentUseCaseIs(useCases: UseCase[], session: ISession | null) {
  return session?.user?.useCase
    ? useCases.includes(session.user.useCase)
    : false;
}
