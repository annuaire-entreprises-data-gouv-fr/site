import { getIAgentScope } from './helpers';
import { ISession } from './session';

/**
 * Application scopes designate specific parts or section of the UI / app
 */
export enum AppScope {
  none = 'none',
  actesRne = 'rne',
  bilansRne = 'rne',
  documentsRne = 'rne',
  conformite = 'conformite',
  protectedCertificats = 'opendata',
  associationProtected = 'opendata',
  mandatairesRCS = 'opendata',
  beneficiaires = 'beneficiaires',
  carteProfessionnelleTravauxPublics = 'opendata',
  nonDiffusible = 'nonDiffusible',
  isAgent = 'isAgent',
}

/**
 * Does the user have the right to access a view
 */
export function hasRights(session: ISession | null, rightScope: AppScope) {
  const userScopes = getIAgentScope(session);
  switch (rightScope) {
    case AppScope.none:
      return true;
    case AppScope.actesRne:
    case AppScope.bilansRne:
    case AppScope.documentsRne:
      return userScopes.includes('rne');
    case AppScope.conformite:
      return userScopes.includes('conformite');
    case AppScope.protectedCertificats:
    case AppScope.carteProfessionnelleTravauxPublics:
    case AppScope.mandatairesRCS:
    case AppScope.associationProtected:
      return userScopes.includes('opendata');
    case AppScope.beneficiaires:
      return userScopes.includes('beneficiaires');
    case AppScope.nonDiffusible:
      return userScopes.includes('nonDiffusible');
    case AppScope.isAgent:
      return userScopes.includes('agent');
    default:
      return false;
  }
}

export function isLoggedIn(session: ISession | null) {
  return getIAgentScope(session).length > 0;
}
