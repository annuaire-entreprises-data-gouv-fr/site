import { getAssociationFromSlug } from "#models/association";
import { getEORIValidation } from "#models/eori-validation";
import { getAssociationProtected } from "#models/espace-agent/association-protected";
import { getBeneficiaires } from "#models/espace-agent/beneficiaires";
import { getBilansProtected } from "#models/espace-agent/bilans";
import { getChiffreAffairesProtected } from "#models/espace-agent/chiffre-affaires";
import { getLiassesFiscalesProtected } from "#models/espace-agent/dgfip/liasses-fiscales";
import { getEffectifsAnnuelsProtected } from "#models/espace-agent/effectifs/annuels";
import { getLiensCapitalistiquesProtected } from "#models/espace-agent/liens-capitalistiques";
import { getDocumentsRNEProtected } from "#models/espace-agent/rne-protected/documents";
import { getTravauxPublic } from "#models/espace-agent/travaux-publics";
import { getDirigeantsRNE } from "#models/rne/dirigeants";
import { getRNEObservations } from "#models/rne/observations";
import { getSubventionsAssociationFromSlug } from "#models/subventions/association";
import { buildAndVerifyTVA } from "#models/tva/verify";
import { APIRoutesPaths } from "./routes-paths";
import { withRateLimiting, withUseCase } from "./utils";

export const APIRoutesHandlers = {
  [APIRoutesPaths.EspaceAgentBeneficiaires]: withRateLimiting(
    withUseCase(getBeneficiaires)
  ),
  [APIRoutesPaths.EspaceAgentRneDocuments]: withRateLimiting(
    getDocumentsRNEProtected
  ),
  [APIRoutesPaths.EspaceAgentAssociationProtected]: getAssociationProtected,
  [APIRoutesPaths.EspaceAgentEffectifsAnnuelsProtected]: withRateLimiting(
    getEffectifsAnnuelsProtected
  ),
  [APIRoutesPaths.EspaceAgentBilansProtected]: withRateLimiting(
    withUseCase(getBilansProtected)
  ),
  [APIRoutesPaths.EspaceAgentChiffreAffairesProtected]: withRateLimiting(
    withUseCase(getChiffreAffairesProtected)
  ),
  [APIRoutesPaths.EspaceAgentTravauxPublics]: withRateLimiting(
    withUseCase(getTravauxPublic)
  ),
  [APIRoutesPaths.EspaceAgentLiassesFiscalesProtected]: withRateLimiting(
    withUseCase(getLiassesFiscalesProtected)
  ),
  [APIRoutesPaths.EspaceAgentLiensCapitalistiquesProtected]: withRateLimiting(
    withUseCase(getLiensCapitalistiquesProtected)
  ),
  [APIRoutesPaths.RneDirigeants]: getDirigeantsRNE,
  [APIRoutesPaths.Observations]: getRNEObservations,
  [APIRoutesPaths.Association]: getAssociationFromSlug,
  [APIRoutesPaths.VerifyTva]: buildAndVerifyTVA,
  [APIRoutesPaths.EoriValidation]: getEORIValidation,
  [APIRoutesPaths.SubventionsAssociation]: withRateLimiting(
    getSubventionsAssociationFromSlug
  ),
};
