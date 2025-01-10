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
  [APIRoutesPaths.EoriValidation]: ApplicationRights.opendata,
  // BTP
  [APIRoutesPaths.EspaceAgentTravauxPublics]: ApplicationRights.travauxPublics,
  // fiscal & social
  [APIRoutesPaths.EspaceAgentBilansProtected]: ApplicationRights.bilans,
  [APIRoutesPaths.EspaceAgentChiffreAffairesProtected]:
    ApplicationRights.chiffreAffaires,
  [APIRoutesPaths.EspaceAgentConformite]: ApplicationRights.conformite,
  [APIRoutesPaths.EspaceAgentEffectifsAnnuelsProtected]:
    ApplicationRights.effectifsAnnuels,
};
