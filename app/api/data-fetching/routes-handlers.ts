import { getAssociationFromSlug } from '#models/association';
import { getEORIValidation } from '#models/eori-validation';
import { getAssociationProtected } from '#models/espace-agent/association-protected';
import { getCarteProfessionnelleTravauxPublic } from '#models/espace-agent/carte-professionnelle-travaux-publics';
import { getOpqibi } from '#models/espace-agent/certificats/opqibi';
import { getQualibat } from '#models/espace-agent/certificats/qualibat';
import { getQualifelec } from '#models/espace-agent/certificats/qualifelec';
import { getConformiteEntreprise } from '#models/espace-agent/conformite';
import { getMandatairesRCS } from '#models/espace-agent/mandataires-rcs';
import { getDocumentsRNEProtected } from '#models/espace-agent/rne-protected/documents';
import { getDirigeantsRNE } from '#models/rne/dirigeants';
import { getRNEObservations } from '#models/rne/observations';
import { getSubventionsAssociationFromSlug } from '#models/subventions/association';
import { buildAndVerifyTVA } from '#models/tva/verify';
import getBeneficiairesController, {
  beneficiaireRoute,
} from './get-beneficiaires-controller';
import { APIRoutesPaths } from './routes-paths';

export const APIRoutesHandlers = {
  [APIRoutesPaths.EspaceAgentCarteProfessionnelleTP]:
    getCarteProfessionnelleTravauxPublic,
  [APIRoutesPaths.EspaceAgentConformite]: getConformiteEntreprise,
  [APIRoutesPaths.EspaceAgentOpqibi]: getOpqibi,
  [APIRoutesPaths.EspaceAgentQualibat]: getQualibat,
  [APIRoutesPaths.EspaceAgentQualifelec]: getQualifelec,
  [APIRoutesPaths.EspaceAgentRcsMandataires]: getMandatairesRCS,
  [beneficiaireRoute]: getBeneficiairesController,
  [APIRoutesPaths.EspaceAgentRneDocuments]: getDocumentsRNEProtected,
  [APIRoutesPaths.EspaceAgentAssociationProtected]: getAssociationProtected,
  [APIRoutesPaths.RneDirigeants]: getDirigeantsRNE,
  [APIRoutesPaths.Observations]: getRNEObservations,
  [APIRoutesPaths.Association]: getAssociationFromSlug,
  [APIRoutesPaths.VerifyTva]: buildAndVerifyTVA,
  [APIRoutesPaths.EoriValidation]: getEORIValidation,
  [APIRoutesPaths.SubventionsAssociation]: getSubventionsAssociationFromSlug,
};
