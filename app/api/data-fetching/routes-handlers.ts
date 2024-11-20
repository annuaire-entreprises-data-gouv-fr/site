import { getAssociationFromSlug } from '#models/association';
import { getEORIValidation } from '#models/eori-validation';
import { getAssociationProtected } from '#models/espace-agent/association-protected';
import { getCarteProfessionnelleTravauxPublic } from '#models/espace-agent/carte-professionnelle-travaux-publics';
import { getCibtp } from '#models/espace-agent/certificats/cibtp';
import { getCnetp } from '#models/espace-agent/certificats/cnetp';
import { getOpqibi } from '#models/espace-agent/certificats/opqibi';
import { getQualibat } from '#models/espace-agent/certificats/qualibat';
import { getQualifelec } from '#models/espace-agent/certificats/qualifelec';
import { getConformiteEntreprise } from '#models/espace-agent/conformite';
import { getDirigeantsProtected } from '#models/espace-agent/dirigeants-protected';
import { getDocumentsRNEProtected } from '#models/espace-agent/rne-protected/documents';
import { getDirigeantsRNE } from '#models/rne/dirigeants';
import { getRNEObservations } from '#models/rne/observations';
import { getSubventionsAssociationFromSlug } from '#models/subventions/association';
import { buildAndVerifyTVA } from '#models/tva/verify';
import getBeneficiairesController from './get-beneficiaires-controller';
import { APIRoutesPaths } from './routes-paths';

export const APIRoutesHandlers = {
  [APIRoutesPaths.EspaceAgentCarteProfessionnelleTP]:
    getCarteProfessionnelleTravauxPublic,
  [APIRoutesPaths.EspaceAgentConformite]: getConformiteEntreprise,
  [APIRoutesPaths.EspaceAgentOpqibi]: getOpqibi,
  [APIRoutesPaths.EspaceAgentCibtp]: getCibtp,
  [APIRoutesPaths.EspaceAgentCnetp]: getCnetp,
  [APIRoutesPaths.EspaceAgentQualibat]: getQualibat,
  [APIRoutesPaths.EspaceAgentQualifelec]: getQualifelec,
  [APIRoutesPaths.EspaceAgentDirigeantsProtected]: getDirigeantsProtected,
  [APIRoutesPaths.EspaceAgentBeneficiaires]: getBeneficiairesController,
  [APIRoutesPaths.EspaceAgentRneDocuments]: getDocumentsRNEProtected,
  [APIRoutesPaths.EspaceAgentAssociationProtected]: getAssociationProtected,
  [APIRoutesPaths.RneDirigeants]: getDirigeantsRNE,
  [APIRoutesPaths.Observations]: getRNEObservations,
  [APIRoutesPaths.Association]: getAssociationFromSlug,
  [APIRoutesPaths.VerifyTva]: buildAndVerifyTVA,
  [APIRoutesPaths.EoriValidation]: getEORIValidation,
  [APIRoutesPaths.SubventionsAssociation]: getSubventionsAssociationFromSlug,
};
