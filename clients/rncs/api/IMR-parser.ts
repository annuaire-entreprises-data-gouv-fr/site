import { XMLParser } from 'fast-xml-parser';
import { HttpNotFound, HttpServerError } from '../../exceptions';

import { IRNCSResponse, IRNCSResponseDossier } from '.';
import { extractBeneficiaires } from './parsers/beneficiaires';
import { extractRepresentants } from './parsers/dirigeants';
import { extractIdentite } from './parsers/identite';
import { Siren } from '../../../utils/helpers/siren-and-siret';
import { logWarningInSentry } from '../../../utils/sentry';

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

    return {
      dirigeants,
      beneficiaires,
      identite,
    };
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      throw e;
    }
    throw new InvalidFormatError(e);
  }
};

const parseXmlToJson = (xmlString: string): IRNCSResponse => {
  const parser = new XMLParser({
    ignoreAttributes: false,
  });
  return parser.parse(xmlString);
};

const extractDossierPrincipal = (
  response: IRNCSResponse,
  siren: string
): IRNCSResponseDossier => {
  const isDossierArray = Array.isArray(response.fichier.dossier);
  const dossiers = (
    isDossierArray ? response.fichier.dossier : [response.fichier.dossier]
  ) as IRNCSResponseDossier[];

  // use most "inscription principale"
  const principaux = dossiers
    .filter((dossier) => dossier.identite.type_inscrip === 'P')
    .sort((a, b) => {
      return (
        new Date(b?.identite?.dat_immat).getTime() -
        new Date(a?.identite?.dat_immat).getTime()
      );
    });

  if (principaux.length > 1) {
    logWarningInSentry('Several inscription principale', { siren });
  } else if (principaux.length === 0) {
    logWarningInSentry('No inscription principale', { siren });
    return dossiers[0];
  }

  return principaux[0];
};
