import { getAssociationFromSlug } from '#models/association';
import { getEORIValidation } from '#models/eori-validation';
import { getAssociationProtected } from '#models/espace-agent/association-protected';
import { getBeneficiaires } from '#models/espace-agent/beneficiaires';
import { getCarteProfessionnelleTravauxPublic } from '#models/espace-agent/carte-professionnelle-travaux-publics';
import { getOpqibi } from '#models/espace-agent/certificats/opqibi';
import { getQualibat } from '#models/espace-agent/certificats/qualibat';
import { getQualifelec } from '#models/espace-agent/certificats/qualifelec';
import { getConformiteEntreprise } from '#models/espace-agent/conformite';
import { getMandatairesRCS } from '#models/espace-agent/mandataires-rcs';
import {
  getDocumentsRNEProtected,
  getImmatriculationRNE,
} from '#models/immatriculation/rne';
import { buildAndVerifyTVA } from '#models/tva/verify';
import { UnwrapPromise } from 'types';
import saveAgentUseCase from './[...slug]/save-use-case';

export const APIRoutesHandlers = {
  'espace-agent/carte-professionnelle-TP': getCarteProfessionnelleTravauxPublic,
  'espace-agent/conformite': getConformiteEntreprise,
  'espace-agent/opqibi': getOpqibi,
  'espace-agent/qualibat': getQualibat,
  'espace-agent/qualifelec': getQualifelec,
  'espace-agent/rcs-mandataires': getMandatairesRCS,
  'espace-agent/beneficiaires': getBeneficiaires,
  'espace-agent/rne/documents': getDocumentsRNEProtected,
  'espace-agent/association-protected': getAssociationProtected,
  rne: getImmatriculationRNE,
  association: getAssociationFromSlug,
  'verify-tva': buildAndVerifyTVA,
  'eori-validation': getEORIValidation,
  'espace-agent/save-use-case': saveAgentUseCase,
} as const;

export type APIPath = keyof typeof APIRoutesHandlers;

export type RouteResponse<T> = T extends APIPath
  ? UnwrapPromise<ReturnType<(typeof APIRoutesHandlers)[T]>>
  : never;
