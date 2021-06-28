import parser from 'fast-xml-parser';
import { NotASirenError, NotLuhnValidSirenError } from '../../models';
import { IDirigeant } from '../../models/dirigeants';
import { verifySiren } from '../../utils/helpers/siren-and-siret';
import { HttpNotFound, HttpServerError } from '../exceptions';

import { IRNCSRepresentantResponse, IRNCSResponse } from './IMR';

export class InvalidFormatError extends HttpServerError {
  constructor(message: string) {
    super(500, 'Unable to parse XML :' + message);
  }
}

export const extractIMRFromXml = (responseAsXml: string) => {
  try {
    const response = parseXmlToJson(responseAsXml);

    let dossier;
    if (Array.isArray(response.fichier.dossier)) {
      dossier = response.fichier.dossier.find(
        (element) => element.representants !== undefined
      );
    } else {
      dossier = response.fichier.dossier;
    }
    const representant = ((dossier || {}).representants || {}).representant;

    if (!representant) {
      throw new HttpNotFound(404, 'No representant in IMR file');
    }

    const isRepresentantAnArray = Array.isArray(representant);

    let dirigeants = [];
    if (isRepresentantAnArray) {
      dirigeants = representant as IRNCSRepresentantResponse[];
    } else {
      dirigeants = [representant] as IRNCSRepresentantResponse[];
    }

    return dirigeants.map(extractDirigeant);
  } catch (e) {
    if (e instanceof NotASirenError || e instanceof NotLuhnValidSirenError) {
      throw e;
    }
    throw new InvalidFormatError(e);
  }
};

const parseXmlToJson = (xmlString: string): IRNCSResponse => {
  const tObj = parser.getTraversalObj(xmlString, { arrayMode: false });
  return parser.convertToJson(tObj, { arrayMode: false });
};

const extractDirigeant = (dirigeant: IRNCSRepresentantResponse): IDirigeant => {
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
      prenom: (prenoms || '').split(' ')[0],
      nom: nom_patronymique,
      role: roles || '',
      lieuNaissance: lieu_naiss + ', ' + code_pays_naiss,
      dateNaissance: (dat_naiss || '').toString().slice(0, 4),
    };
  } else {
    const sirenAsString = (siren || '').toString();
    return {
      siren: verifySiren(sirenAsString),
      denomination: denomination,
      role: roles || '',
      natureJuridique: form_jur,
    };
  }
};
