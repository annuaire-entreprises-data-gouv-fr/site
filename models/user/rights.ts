import { getAgentScopes } from './helpers';
import { ISession } from './session';

export enum EScope {
  none = 'none',
  actesRne = 'rne',
  bilansRne = 'rne',
  documentsRne = 'rne',
  conformite = 'conformite',
  protectedCertificats = 'opendata',
  associationProtected = 'opendata',
  mandatairesRCS = 'opendata',
  beneficiaires = 'opendata',
  carteProfessionnelleTravauxPublics = 'opendata',
  nonDiffusible = 'nonDiffusible',
  isAgent = 'isAgent',
}

/**
 * Has rights to access a view
 */
export function hasRights(session: ISession | null, rightScope: EScope) {
  const userScopes = getAgentScopes(session);
  switch (rightScope) {
    case EScope.none:
      return true;
    case EScope.actesRne:
    case EScope.bilansRne:
    case EScope.documentsRne:
      return userScopes.includes('rne');
    case EScope.conformite:
      return userScopes.includes('conformite');
    case EScope.protectedCertificats:
    case EScope.carteProfessionnelleTravauxPublics:
    case EScope.mandatairesRCS:
    case EScope.beneficiaires:
    case EScope.associationProtected:
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
  return getAgentScopes(session).length > 0;
}
