import { ApplicationRights } from '#models/user/rights';
import { APIPath } from './routes-handlers';

export const APIRoutesScopes: Record<APIPath, ApplicationRights> = {
  'espace-agent/carte-professionnelle-TP':
    ApplicationRights.carteProfessionnelleTravauxPublics,
  'espace-agent/conformite': ApplicationRights.conformite,
  'espace-agent/opqibi': ApplicationRights.protectedCertificats,
  'espace-agent/qualibat': ApplicationRights.protectedCertificats,
  'espace-agent/qualifelec': ApplicationRights.protectedCertificats,
  'espace-agent/rcs-mandataires': ApplicationRights.mandatairesRCS,
  'espace-agent/beneficiaires': ApplicationRights.beneficiaires,
  'espace-agent/rne/documents': ApplicationRights.documentsRne,
  'espace-agent/association-protected': ApplicationRights.associationProtected,
  'rne-dirigeants': ApplicationRights.opendata,
  observations: ApplicationRights.opendata,
  association: ApplicationRights.opendata,
  'verify-tva': ApplicationRights.opendata,
  'eori-validation': ApplicationRights.opendata,
  'subventions-association': ApplicationRights.subventionsAssociation,
};
