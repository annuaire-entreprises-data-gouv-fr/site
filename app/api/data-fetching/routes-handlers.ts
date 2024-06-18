import { getAssociationFromSlug } from '#models/association';
import { getCarteProfessionnelleTravauxPublic } from '#models/espace-agent/carte-professionnelle-travaux-publics';
import { getOpqibi } from '#models/espace-agent/certificats/opqibi';
import { getQualibat } from '#models/espace-agent/certificats/qualibat';
import { getQualifelec } from '#models/espace-agent/certificats/qualifelec';
import { getConformiteEntreprise } from '#models/espace-agent/conformite';
import { getMandatairesRCS } from '#models/espace-agent/mandataires-rcs';
import { searchGeoElementByText } from '#models/geo';
import {
  getDocumentsRNEProtected,
  getImmatriculationRNE,
} from '#models/immatriculation/rne';
import { buildAndVerifyTVA } from '#models/tva/verify';
import { UnwrapPromise } from 'types';

export const APIRoutesHandlers = {
  'espace-agent/carte-professionnelle-TP': getCarteProfessionnelleTravauxPublic,
  'espace-agent/conformite': getConformiteEntreprise,
  'espace-agent/opqibi': getOpqibi,
  'espace-agent/qualibat': getQualibat,
  'espace-agent/qualifelec': getQualifelec,
  'espace-agent/rcs-mandataires': getMandatairesRCS,
  'espace-agent/rne/documents': getDocumentsRNEProtected,
  rne: getImmatriculationRNE,
  association: getAssociationFromSlug,
  'verify-tva': buildAndVerifyTVA,
  geo: searchGeoElementByText,
} as const;

export type APIPath = keyof typeof APIRoutesHandlers;

export type RouteResponse<T> = T extends APIPath
  ? UnwrapPromise<ReturnType<(typeof APIRoutesHandlers)[T]>>
  : never;
