import { ApplicationRights } from "#models/authentication/user/rights";
import { APIRoutesPaths } from "./routes-paths";

export const APIRoutesScopes: Record<APIRoutesPaths, ApplicationRights> = {
  // full open data & RNE
  [APIRoutesPaths.RneDirigeants]: ApplicationRights.opendata,
  [APIRoutesPaths.Observations]: ApplicationRights.opendata,
  [APIRoutesPaths.Association]: ApplicationRights.opendata,
  [APIRoutesPaths.VerifyTva]: ApplicationRights.opendata,
  [APIRoutesPaths.EoriValidation]: ApplicationRights.opendata,
  // documents RNE - Open data but restricted to agents only
  [APIRoutesPaths.EspaceAgentRneDocuments]: ApplicationRights.documentsRne,
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
  [APIRoutesPaths.EspaceAgentQualibat]: ApplicationRights.protectedCertificats,
  [APIRoutesPaths.EspaceAgentQualifelec]:
    ApplicationRights.protectedCertificats,
  // BTP
  [APIRoutesPaths.EspaceAgentTravauxPublics]: ApplicationRights.travauxPublics,
  // fiscal & social
  [APIRoutesPaths.EspaceAgentBilansProtected]: ApplicationRights.bilansBDF,
  [APIRoutesPaths.EspaceAgentChiffreAffairesProtected]:
    ApplicationRights.chiffreAffaires,
  [APIRoutesPaths.EspaceAgentEffectifsAnnuelsProtected]:
    ApplicationRights.effectifsAnnuels,
  [APIRoutesPaths.EspaceAgentLiassesFiscalesProtected]:
    ApplicationRights.liassesFiscales,
  [APIRoutesPaths.EspaceAgentLiensCapitalistiquesProtected]:
    ApplicationRights.liensCapitalistiques,
};
