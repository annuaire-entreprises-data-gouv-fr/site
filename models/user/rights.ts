import { getIAgentScope } from './helpers';
import { ISession } from './session';

/**
 * Application scopes designate specific parts or section of the UI / app
 */
export enum ApplicationRights {
  opendata = 'Données en open data',
  isAgent = 'Compte agent public',
  nonDiffusible = 'Données des entreprises non diffusibles',
  actesRne = 'Actes au RNE',
  bilansRne = 'Bilans au RNE',
  documentsRne = 'Documents au RNE',
  protectedCertificats = 'Certificats Qualifelec, Qualibat et OPQIBI',
  associationProtected = 'Actes, statuts et données des dirigeants des associations',
  mandatairesRCS = 'État civil complet des dirigeants d’entreprise',
  carteProfessionnelleTravauxPublics = 'Carte professionnelle travaux publics (FNTP)',
  beneficiaires = 'Registre des Bénéficiaires Effectifs',
  conformite = 'Attestations de conformité fiscale (DGFiP) et sociale (Urssaf & MSA)',
  subventionsAssociation = 'Données des subventions des associations',
}

/**
 * Does the user have the right to access a view
 */
export function hasRights(session: ISession | null, right: ApplicationRights) {
  const userScopes = getIAgentScope(session);
  switch (right) {
    case ApplicationRights.opendata:
      return true;
    case ApplicationRights.actesRne:
    case ApplicationRights.bilansRne:
    case ApplicationRights.documentsRne:
      return userScopes.includes('rne');
    case ApplicationRights.conformite:
      return userScopes.includes('conformite');
    case ApplicationRights.protectedCertificats:
    case ApplicationRights.carteProfessionnelleTravauxPublics:
    case ApplicationRights.mandatairesRCS:
    case ApplicationRights.associationProtected:
      return userScopes.includes('opendata');
    case ApplicationRights.beneficiaires:
      return userScopes.includes('beneficiaires');
    case ApplicationRights.subventionsAssociation:
      return userScopes.includes('subventions_association');
    case ApplicationRights.nonDiffusible:
      return userScopes.includes('nonDiffusible');
    case ApplicationRights.isAgent:
      return userScopes.includes('agent');
    default:
      return false;
  }
}

export function isLoggedIn(session: ISession | null) {
  return getIAgentScope(session).length > 0;
}
