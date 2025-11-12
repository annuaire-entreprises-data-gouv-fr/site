import { ApplicationRights } from "#models/authentication/user/rights";
import { APIRoutesPaths } from "./routes-paths";

export const APIRoutesScopes: Record<APIRoutesPaths, ApplicationRights> = {
  // full open data & RNE
  [APIRoutesPaths.RneDirigeants]: ApplicationRights.opendata,
  [APIRoutesPaths.Observations]: ApplicationRights.opendata,
  [APIRoutesPaths.Association]: ApplicationRights.opendata,
  [APIRoutesPaths.VerifyTva]: ApplicationRights.opendata,
  [APIRoutesPaths.EoriValidation]: ApplicationRights.opendata,
  //association
  [APIRoutesPaths.SubventionsAssociation]:
    ApplicationRights.subventionsAssociation,
  // BTP
  [APIRoutesPaths.EspaceAgentTravauxPublics]: ApplicationRights.travauxPublics,
  // fiscal & social
  [APIRoutesPaths.EspaceAgentBilansProtected]: ApplicationRights.bilansBDF,
  [APIRoutesPaths.EspaceAgentChiffreAffairesProtected]:
    ApplicationRights.chiffreAffaires,
  [APIRoutesPaths.EspaceAgentLiassesFiscalesProtected]:
    ApplicationRights.liassesFiscales,
  [APIRoutesPaths.EspaceAgentLiensCapitalistiquesProtected]:
    ApplicationRights.liensCapitalistiques,
};
