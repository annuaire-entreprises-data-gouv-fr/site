import { ISession } from './session';

export enum EScope {
  actesRne = 'rne',
  bilansRne = 'rne',
  documentsRne = 'rne',
  conformite = 'conformite',
  eori = 'opendata',
  nonDiffusible = 'nonDiffusible',
  isAgent = 'isAgent',
}

/**
 * Has rights to access a view
 */
export function hasRights(session: ISession | null, rightScope: EScope) {
  const userScopes = session?.user?.scopes || [];

  switch (rightScope) {
    case EScope.actesRne:
    case EScope.bilansRne:
    case EScope.documentsRne:
      return userScopes.includes('rne');
    case EScope.conformite:
      return userScopes.includes('conformite');
    case EScope.eori:
      return userScopes.includes('opendata');
    case EScope.nonDiffusible:
      return userScopes.includes('nonDiffusible');
    case EScope.isAgent:
      return userScopes.includes('agent');
    default:
      return false;
  }
}

export function isLoggedIn(session: ISession | null) {
  return (session?.user?.scopes || []).length > 0;
}
