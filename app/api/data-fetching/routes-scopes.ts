import { ApplicationRights } from '#models/user/rights';
import { APIRoutesPaths } from './routes-paths';

export const APIRoutesScopes: Record<APIRoutesPaths, ApplicationRights> = {
  [APIRoutesPaths.EspaceAgentCarteProfessionnelleTP]:
    ApplicationRights.carteProfessionnelleTravauxPublics,
  [APIRoutesPaths.EspaceAgentConformite]: ApplicationRights.conformite,
  [APIRoutesPaths.EspaceAgentOpqibi]: ApplicationRights.protectedCertificats,
  [APIRoutesPaths.EspaceAgentQualibat]: ApplicationRights.protectedCertificats,
  [APIRoutesPaths.EspaceAgentQualifelec]:
    ApplicationRights.protectedCertificats,
  [APIRoutesPaths.EspaceAgentBeneficiaires]: ApplicationRights.beneficiaires,
  [APIRoutesPaths.EspaceAgentRneDocuments]: ApplicationRights.documentsRne,
  [APIRoutesPaths.EspaceAgentDirigeantsProtected]:
    ApplicationRights.mandatairesRCS,
  [APIRoutesPaths.EspaceAgentAssociationProtected]:
    ApplicationRights.associationProtected,
  [APIRoutesPaths.RneDirigeants]: ApplicationRights.opendata,
  [APIRoutesPaths.Observations]: ApplicationRights.opendata,
  [APIRoutesPaths.Association]: ApplicationRights.opendata,
  [APIRoutesPaths.VerifyTva]: ApplicationRights.opendata,
  [APIRoutesPaths.EoriValidation]: ApplicationRights.opendata,
  [APIRoutesPaths.SubventionsAssociation]:
    ApplicationRights.subventionsAssociation,
  [APIRoutesPaths.EspaceAgentCibtp]: ApplicationRights.protectedCertificats,
  [APIRoutesPaths.EspaceAgentCnetp]: ApplicationRights.protectedCertificats,
};
