import { ApplicationRights } from '#models/user/rights';
import { APIRoutesPaths } from './routes-paths';

export const APIRoutesScopes: Record<APIRoutesPaths, ApplicationRights> = {
  // person
  [APIRoutesPaths.EspaceAgentBeneficiaires]: ApplicationRights.beneficiaires,
  [APIRoutesPaths.EspaceAgentDirigeantsProtected]:
    ApplicationRights.mandatairesRCS,
  //association
  [APIRoutesPaths.EspaceAgentAssociationProtected]:
    ApplicationRights.associationProtected,
  [APIRoutesPaths.SubventionsAssociation]:
    ApplicationRights.subventionsAssociation,
  // certificats
  [APIRoutesPaths.EspaceAgentOpqibi]: ApplicationRights.protectedCertificats,
  [APIRoutesPaths.EspaceAgentQualibat]: ApplicationRights.protectedCertificats,
  [APIRoutesPaths.EspaceAgentQualifelec]:
    ApplicationRights.protectedCertificats,
  // pseudo open data & RNE
  [APIRoutesPaths.RneDirigeants]: ApplicationRights.opendata,
  [APIRoutesPaths.Observations]: ApplicationRights.opendata,
  [APIRoutesPaths.Association]: ApplicationRights.opendata,
  [APIRoutesPaths.VerifyTva]: ApplicationRights.opendata,
  [APIRoutesPaths.EspaceAgentRneDocuments]: ApplicationRights.documentsRne,
  // BTP
  [APIRoutesPaths.EoriValidation]: ApplicationRights.opendata,
  [APIRoutesPaths.EspaceAgentCibtp]: ApplicationRights.cibtp,
  [APIRoutesPaths.EspaceAgentCnetp]: ApplicationRights.cnetp,
  [APIRoutesPaths.EspaceAgentProbtp]: ApplicationRights.probtp,
  [APIRoutesPaths.EspaceAgentCarteProfessionnelleTP]:
    ApplicationRights.carteProfessionnelleTravauxPublics,
  // fiscal & social
  [APIRoutesPaths.EspaceAgentConformite]: ApplicationRights.conformite,
  [APIRoutesPaths.EspaceAgentChiffreAffairesProtected]:
    ApplicationRights.chiffreAffaires,
};
