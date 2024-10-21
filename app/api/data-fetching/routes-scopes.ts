import { AppScope } from '#models/user/rights';
import { APIRoutesPaths } from './routes-paths';

export const APIRoutesScopes: Record<APIRoutesPaths, AppScope> = {
  [APIRoutesPaths.EspaceAgentCarteProfessionnelleTP]:
    AppScope.carteProfessionnelleTravauxPublics,
  [APIRoutesPaths.EspaceAgentConformite]: AppScope.conformite,
  [APIRoutesPaths.EspaceAgentOpqibi]: AppScope.protectedCertificats,
  [APIRoutesPaths.EspaceAgentQualibat]: AppScope.protectedCertificats,
  [APIRoutesPaths.EspaceAgentQualifelec]: AppScope.protectedCertificats,
  [APIRoutesPaths.EspaceAgentRcsMandataires]: AppScope.mandatairesRCS,
  [APIRoutesPaths.EspaceAgentBeneficiaires]: AppScope.beneficiaires,
  [APIRoutesPaths.EspaceAgentRneDocuments]: AppScope.documentsRne,
  [APIRoutesPaths.EspaceAgentAssociationProtected]:
    AppScope.associationProtected,
  [APIRoutesPaths.RneDirigeants]: AppScope.opendata,
  [APIRoutesPaths.Observations]: AppScope.opendata,
  [APIRoutesPaths.Association]: AppScope.opendata,
  [APIRoutesPaths.VerifyTva]: AppScope.opendata,
  [APIRoutesPaths.EoriValidation]: AppScope.opendata,
  [APIRoutesPaths.SubventionsAssociation]: AppScope.subventionsAssociation,
};
