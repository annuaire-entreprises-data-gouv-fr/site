import { ISession } from './session';

export enum EScope {
  actesRne = 'rne',
  bilansRne = 'rne',
  documentsRne = 'rne',
  conformite = 'conformite',
  eori = 'opendata',
  qualifelec = 'opendata',
  qualibat = 'opendata',
  opqibi = 'opendata',
  mandatairesRCS = 'opendata',
  carteProfessionnelleTravauxPublics = 'opendata',
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
    case EScope.qualifelec:
    case EScope.opqibi:
    case EScope.qualibat:
    case EScope.carteProfessionnelleTravauxPublics:
    case EScope.mandatairesRCS:
      return userScopes.includes('opendata');

    case EScope.nonDiffusible:
      return userScopes.includes('nonDiffusible');
    case EScope.isAgent:
      return userScopes.includes('agent');
    default:
      return false;
  }
}

export function hasAnyRights(session: ISession | null, scopes: EScope[]) {
  return scopes.some((scope) => hasRights(session, scope));
}

export function isLoggedIn(session: ISession | null) {
  return (session?.user?.scopes || []).length > 0;
}

export type INotAuthorized = {
  __I_NOT_AUTHORIZED__: never;
};

export function isNotAuthorized<T>(
  toBeDetermined: T | INotAuthorized
): toBeDetermined is INotAuthorized {
  if ((toBeDetermined as INotAuthorized).__I_NOT_AUTHORIZED__) {
    return true;
  }
  return false;
}

export function notAuthorized(): INotAuthorized {
  return { __I_NOT_AUTHORIZED__: true } as unknown as INotAuthorized;
}
