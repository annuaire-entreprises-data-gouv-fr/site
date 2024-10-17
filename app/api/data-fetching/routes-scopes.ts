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
  'rne-dirigeants': AppScope.opendata,
  observations: AppScope.opendata,
  association: AppScope.opendata,
  'verify-tva': AppScope.opendata,
  'eori-validation': AppScope.opendata,
  'subventions-association': AppScope.subventionsAssociation,
};
