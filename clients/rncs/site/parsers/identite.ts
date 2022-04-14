import {
  escapeTerm,
  formatFirstNames,
  formatNameFull,
} from '../../../../utils/helpers/formatting';
import { formatINPIDateField } from '../../helper';
import { extractFromHtmlBlock, parseNameAndRole } from './helpers';

const parseIdentiteBlocks = (identiteHtml: Element) => {
  const blocsHtml = identiteHtml.querySelectorAll('div.bloc-detail-notice');

  const parsedBlocs = {} as any;

  for (var i = 0; i < blocsHtml.length; i++) {
    const { label, text } = extractFromHtmlBlock(blocsHtml[i]);
    parsedBlocs[escapeTerm(label)] = text;
  }
  return parsedBlocs;
};

const parseIdentite = (identiteHtml: Element, radiationText: string) => {
  const parsedBlocks = parseIdentiteBlocks(identiteHtml);
  const get = (key: string) => parsedBlocks[escapeTerm(key)] || null;
  const getDate = (key: string) => formatINPIDateField(get(key)) || null;

  const radiationDate =
    radiationText.replace('(Entreprise radiée le ', '').replace(')', '') || '';

  if (!!get('Dénomination')) {
    // personne morale
    return {
      greffe: null,
      codeGreffe: null,
      numeroRCS: null,
      numGestion: get('N° de gestion'),
      dateImmatriculation: getDate("Date d'immatriculation"),
      dateDebutActiv: getDate('Début d’activité'),
      dateGreffe: null,
      dateRadiation: formatINPIDateField(radiationDate) || null,
      dateCessationActivite: getDate("Date de cessation d'activité"),
      denomination: get('Dénomination'),
      dureePersonneMorale: get('Durée de la personne morale'),
      dateClotureExercice: get('Date de clôture'),
      capital: get('Capital social').trim(),
      isPersonneMorale: true,
      libelleNatureJuridique: get('Forme juridique'),
    };
  } else {
    return {
      greffe: null,
      codeGreffe: null,
      numeroRCS: null,
      numGestion: get('N° de gestion'),
      dateImmatriculation: getDate("Date d'immatriculation"),
      dateDebutActiv: getDate('Début d’activité'),
      dateGreffe: null,
      dateRadiation: formatINPIDateField(radiationDate) || null,
      dateCessationActivite: getDate("Date de cessation d'activité"),
      denomination: get('Nom, Prénom(s)'),
      dureePersonneMorale: null,
      dateClotureExercice: null,
      capital: null,
      isPersonneMorale: false,
      libelleNatureJuridique: 'Entreprise individuelle',
    };
  }
};

export const extractDirigeantFromIdentite = (identiteHtml: Element) => {
  const parsedBlocks = parseIdentiteBlocks(identiteHtml);
  const { nom, prenom } = parseNameAndRole(
    parsedBlocks[escapeTerm('Nom, Prénom(s)')] || ''
  );

  return {
    sexe: null,
    prenom: prenom,
    nom: nom,
    role: 'Représentant Légal',
    lieuNaissance: null,
    dateNaissance: parsedBlocks['Date de naissance (mm/aaaa)'] || null,
  };
};

export default parseIdentite;
