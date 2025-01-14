import { getAssociationFromSlug } from '#models/association';
import { getEORIValidation } from '#models/eori-validation';
import { getAssociationProtected } from '#models/espace-agent/association-protected';
import { getBeneficiaires } from '#models/espace-agent/beneficiaires';
import { getBilansProtected } from '#models/espace-agent/bilans';
import { getOpqibi } from '#models/espace-agent/certificats/opqibi';
import { getQualibat } from '#models/espace-agent/certificats/qualibat';
import { getQualifelec } from '#models/espace-agent/certificats/qualifelec';
import { getChiffreAffairesProtected } from '#models/espace-agent/chiffre-affaires';
import { getConformiteEntreprise } from '#models/espace-agent/conformite';
import { getDirigeantsProtected } from '#models/espace-agent/dirigeants-protected';
import { getEffectifsAnnuelsProtected } from '#models/espace-agent/effectifs/annuels';
import { getDocumentsRNEProtected } from '#models/espace-agent/rne-protected/documents';
import { getTravauxPublic } from '#models/espace-agent/travaux-publics';
import { getDirigeantsRNE } from '#models/rne/dirigeants';
import { getRNEObservations } from '#models/rne/observations';
import { getSubventionsAssociationFromSlug } from '#models/subventions/association';
import { buildAndVerifyTVA } from '#models/tva/verify';
import { APIRoutesPaths } from './routes-paths';
import { withUseCase } from './utils';

export const APIRoutesHandlers = {
  [APIRoutesPaths.EspaceAgentConformite]: getConformiteEntreprise,
  [APIRoutesPaths.EspaceAgentOpqibi]: getOpqibi,
  [APIRoutesPaths.EspaceAgentQualibat]: getQualibat,
  [APIRoutesPaths.EspaceAgentQualifelec]: getQualifelec,
  [APIRoutesPaths.EspaceAgentDirigeantsProtected]: getDirigeantsProtected,
  [APIRoutesPaths.EspaceAgentBeneficiaires]: withUseCase(getBeneficiaires),
  [APIRoutesPaths.EspaceAgentRneDocuments]: getDocumentsRNEProtected,
  [APIRoutesPaths.EspaceAgentAssociationProtected]: getAssociationProtected,
  [APIRoutesPaths.EspaceAgentEffectifsAnnuelsProtected]:
    getEffectifsAnnuelsProtected,
  [APIRoutesPaths.EspaceAgentBilansProtected]: getBilansProtected,
  [APIRoutesPaths.EspaceAgentChiffreAffairesProtected]:
    getChiffreAffairesProtected,
  [APIRoutesPaths.EspaceAgentTravauxPublics]: withUseCase(getTravauxPublic),
  getChiffreAffairesProtected,
  [APIRoutesPaths.RneDirigeants]: getDirigeantsRNE,
  [APIRoutesPaths.Observations]: getRNEObservations,
  [APIRoutesPaths.Association]: getAssociationFromSlug,
  [APIRoutesPaths.VerifyTva]: buildAndVerifyTVA,
  [APIRoutesPaths.EoriValidation]: getEORIValidation,
  [APIRoutesPaths.SubventionsAssociation]: getSubventionsAssociationFromSlug,
};
