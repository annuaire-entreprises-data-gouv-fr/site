import parser from 'fast-xml-parser';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { HttpNotFound, HttpServerError } from '../exceptions';

import { IRNCSResponse, IRNCSResponseDossier } from './IMR';
import { extractBeneficiaires } from './parsers/beneficiaires';
import { extractRepresentants } from './parsers/dirigeants';
import { extractIdentite } from './parsers/identite';

export class InvalidFormatError extends HttpServerError {
  constructor(message: string) {
    super(500, 'Unable to parse XML :' + message);
  }
}

export const extractIMRFromXml = (responseAsXml: string, siren: Siren) => {
  try {
    const response = parseXmlToJson(responseAsXml);
    const dossiers = extractDossiers(response, siren);
    const dirigeants = extractRepresentants(dossiers);
    const beneficiaires = extractBeneficiaires(dossiers);
    const identite = extractIdentite(dossiers, siren);

    return {
      dirigeants,
      beneficiaires,
      identite,
    };
  } catch (e) {
    if (e instanceof HttpNotFound) {
      throw e;
    }
    throw new InvalidFormatError(e);
  }
};

const parseXmlToJson = (xmlString: string): IRNCSResponse => {
  const tObj = parser.getTraversalObj(xmlString, {
    arrayMode: false,
    ignoreAttributes: false,
  });
  return parser.convertToJson(tObj, { arrayMode: false });
};

const extractDossiers = (
  response: IRNCSResponse,
  siren: Siren
): IRNCSResponseDossier[] => {
  const isDossierArray = Array.isArray(response.fichier.dossier);
  const dossier = (
    isDossierArray ? response.fichier.dossier : [response.fichier.dossier]
  ) as IRNCSResponseDossier[];

  let dossiersWithRepresentants = dossier.filter(
    (element) => element.representants !== undefined
  );

  return dossiersWithRepresentants;
};

export const selectRelevantRecord = (array: any[][]): any[] => {
  if (array.length === 0) {
    return [];
  }

  // if several possibilities, use the record with the most elements
  return array.sort((a, b) => b.length - a.length)[0];
};
