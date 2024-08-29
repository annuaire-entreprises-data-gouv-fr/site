import { EScope } from '#models/user/rights';
import { APIPath } from './routes-handlers';

export const APIRoutesScopes: Record<APIPath, EScope> = {
  'espace-agent/carte-professionnelle-TP':
    EScope.carteProfessionnelleTravauxPublics,
  'espace-agent/conformite': EScope.conformite,
  'espace-agent/opqibi': EScope.protectedCertificats,
  'espace-agent/qualibat': EScope.protectedCertificats,
  'espace-agent/qualifelec': EScope.protectedCertificats,
  'espace-agent/rcs-mandataires': EScope.mandatairesRCS,
  'espace-agent/rne/documents': EScope.documentsRne,
  'espace-agent/association-protected': EScope.associationProtected,
  // public routes
  'rne-dirigeants': EScope.none,
  observations: EScope.none,
  association: EScope.none,
  'verify-tva': EScope.none,
  'eori-validation': EScope.none,
};
