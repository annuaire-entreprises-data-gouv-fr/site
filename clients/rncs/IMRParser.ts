import parser from 'fast-xml-parser';
import { IDirigeant } from '../../models/dirigeants';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { logWarningInSentry } from '../../utils/sentry';
import { HttpNotFound, HttpServerError } from '../exceptions';

import {
  IRNCSRepresentantResponse,
  IRNCSResponse,
  IRNCSResponseDossier,
} from './IMR';

export class InvalidFormatError extends HttpServerError {
  constructor(message: string) {
    super(500, 'Unable to parse XML :' + message);
  }
}

export const extractIMRFromXml = (responseAsXml: string, siren: Siren) => {
  try {
    const response = parseXmlToJson(responseAsXml);
    const dossiers = extractDossiers(response, siren);
    const representants = dossiers.map(extractRepresentants);

    // filter correct representants
    if (representants.length === 0) {
      throw new HttpNotFound(404, 'No representant in IMR file');
    }

    const selectedRepresentant = representants.sort(
      (a, b) => b.length - a.length
    )[0];

    return selectedRepresentant.map(mapRepresentantToDirigeants);
  } catch (e) {
    if (e instanceof HttpNotFound) {
      throw e;
    }
    throw new InvalidFormatError(e);
  }
};

const parseXmlToJson = (xmlString: string): IRNCSResponse => {
  const tObj = parser.getTraversalObj(xmlString, { arrayMode: false });
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

  if (dossiersWithRepresentants.length > 1) {
    logWarningInSentry(
      `${dossiersWithRepresentants.length} dossiers found in IMR`,
      { siren }
    );
  }

  return dossiersWithRepresentants;
};

const extractRepresentants = (dossier: IRNCSResponseDossier) => {
  const representant = ((dossier || {}).representants || {}).representant;
  const isRepresentantAnArray = Array.isArray(representant);
  const dirigeants = isRepresentantAnArray ? representant : [representant];
  return dirigeants as IRNCSRepresentantResponse[];
};

const mapRepresentantToDirigeants = (
  dirigeant: IRNCSRepresentantResponse
): IDirigeant => {
  const {
    prenoms,
    nom_patronymique,
    lieu_naiss,
    code_pays_naiss,
    dat_naiss,
    qualites,
    form_jur,
    siren,
    denomination,
    type,
  } = dirigeant;

  const qualite = (qualites || {}).qualite;
  const roles = Array.isArray(qualite) ? qualite.join(', ') : qualite;

  if (type === 'P.Physique') {
    return {
      sexe: null,
      prenom: (prenoms || '').split(' ')[0],
      nom: nom_patronymique || '',
      role: roles || '',
      lieuNaissance: (lieu_naiss || '') + ', ' + (code_pays_naiss || ''),
      dateNaissance: (dat_naiss || '').toString().slice(0, 4),
    };
  } else {
    const sirenAsString = (siren || '').toString();
    return {
      siren: sirenAsString,
      denomination: denomination || '',
      role: roles || '',
      natureJuridique: form_jur || '',
    };
  }
};
