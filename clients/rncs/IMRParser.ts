import parser from 'fast-xml-parser';
import { Siren } from '../../utils/helpers/siren-and-siret';
import logErrorInSentry, { logWarningInSentry } from '../../utils/sentry';
import { HttpNotFound, HttpServerError } from '../exceptions';

import { IRNCSResponse, IRNCSResponseDossier } from './IMR';
import { extractBeneficiaires } from './parsers/beneficiaires';
import {
  extractDirigeantFromIdentite,
  extractRepresentants,
} from './parsers/dirigeants';
import { extractIdentite } from './parsers/identite';

export class InvalidFormatError extends HttpServerError {
  constructor(message: string) {
    super(500, 'Unable to parse XML :' + message);
  }
}

export const extractIMRFromXml = (responseAsXml: string, siren: Siren) => {
  try {
    const response = parseXmlToJson(responseAsXml);
    const dossierPrincipal = extractDossierPrincipal(response, siren);
    const dirigeants = extractRepresentants(dossierPrincipal);
    const beneficiaires = extractBeneficiaires(dossierPrincipal);
    const identite = extractIdentite(dossierPrincipal);

    if (dirigeants.length === 0 && !identite.isPersonneMorale) {
      dirigeants.push(extractDirigeantFromIdentite(dossierPrincipal));
    }

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

const extractDossierPrincipal = (
  response: IRNCSResponse,
  siren: string
): IRNCSResponseDossier => {
  const isDossierArray = Array.isArray(response.fichier.dossier);
  const dossiers = (
    isDossierArray ? response.fichier.dossier : [response.fichier.dossier]
  ) as IRNCSResponseDossier[];

  const principaux = dossiers.filter(
    (dossier) => dossier.identite.type_inscrip === 'P'
  );

  if (principaux.length > 1) {
    logWarningInSentry('Several inscription principale', { siren });
    return principaux[0];
  } else if (principaux.length === 0) {
    logErrorInSentry('No inscription principale', { siren });
    throw new HttpNotFound(404, 'No inscription principale');
  }
  return principaux[0];
};
