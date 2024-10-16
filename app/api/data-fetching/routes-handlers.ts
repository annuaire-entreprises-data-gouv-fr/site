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
import { UnwrapPromise } from 'types';
import getBeneficiairesController, {
  beneficiaireRoute,
} from './get-beneficiaires-controller';

export const APIRoutesHandlers = {
  'espace-agent/carte-professionnelle-TP': getCarteProfessionnelleTravauxPublic,
  'espace-agent/conformite': getConformiteEntreprise,
  'espace-agent/opqibi': getOpqibi,
  'espace-agent/qualibat': getQualibat,
  'espace-agent/qualifelec': getQualifelec,
  'espace-agent/rcs-mandataires': getMandatairesRCS,
  [beneficiaireRoute]: getBeneficiairesController,
  'espace-agent/rne/documents': getDocumentsRNEProtected,
  'espace-agent/association-protected': getAssociationProtected,
  'rne-dirigeants': getDirigeantsRNE,
  observations: getRNEObservations,
  association: getAssociationFromSlug,
  'verify-tva': buildAndVerifyTVA,
  'eori-validation': getEORIValidation,
  'subventions-association': getSubventionsAssociationFromSlug,
} as const;

export type APIPath = keyof typeof APIRoutesHandlers;

export type RouteResponse<T> = T extends APIPath
  ? UnwrapPromise<ReturnType<(typeof APIRoutesHandlers)[T]>>
  : never;

export type RouteParams<T> = T extends APIPath
  ? Parameters<(typeof APIRoutesHandlers)[T]>[1]
  : never;
