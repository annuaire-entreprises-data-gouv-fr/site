import { AppScope } from '#models/user/rights';
import { APIPath } from './routes-handlers';

export const APIRoutesScopes: Record<APIPath, AppScope> = {
  'espace-agent/carte-professionnelle-TP':
    AppScope.carteProfessionnelleTravauxPublics,
  'espace-agent/conformite': AppScope.conformite,
  'espace-agent/opqibi': AppScope.protectedCertificats,
  'espace-agent/qualibat': AppScope.protectedCertificats,
  'espace-agent/qualifelec': AppScope.protectedCertificats,
  'espace-agent/rcs-mandataires': AppScope.mandatairesRCS,
  'espace-agent/beneficiaires': AppScope.beneficiaires,
  'espace-agent/rne/documents': AppScope.documentsRne,
  'espace-agent/association-protected': AppScope.associationProtected,
  'rne-dirigeants': AppScope.none,
  observations: AppScope.none,
  association: AppScope.none,
  'verify-tva': AppScope.none,
  'eori-validation': AppScope.none,
  'subventions-association': AppScope.subventionsAssociation,
};
