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
  [APIRoutesPaths.EspaceAgentRcsMandataires]: ApplicationRights.mandatairesRCS,
  [APIRoutesPaths.EspaceAgentBeneficiaires]: ApplicationRights.beneficiaires,
  [APIRoutesPaths.EspaceAgentRneDocuments]: ApplicationRights.documentsRne,
  [APIRoutesPaths.EspaceAgentAssociationProtected]:
    ApplicationRights.associationProtected,
  [APIRoutesPaths.RneDirigeants]: ApplicationRights.opendata,
  [APIRoutesPaths.Observations]: ApplicationRights.opendata,
  [APIRoutesPaths.Association]: ApplicationRights.opendata,
  [APIRoutesPaths.VerifyTva]: ApplicationRights.opendata,
  [APIRoutesPaths.EoriValidation]: ApplicationRights.opendata,
  [APIRoutesPaths.SubventionsAssociation]:
    ApplicationRights.subventionsAssociation,
};
