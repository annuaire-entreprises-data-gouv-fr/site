import { formatINPIDateField } from '../helper';
import * as cheerio from 'cheerio';

const parseIdentite = (html: string) => {
  const $ = cheerio.load(html);

  const getLabel = (label: string) =>
    $(`p:contains("${label}")`, '#notice-description').next().first().text();

  const getDate = (label: string) =>
    formatINPIDateField(
      $(`p:contains("${label}")`, '#notice-description')
        .next()
        .first()
        .text()
        .trim()
    );

  return {
    greffe: '',
    codeGreffe: '',
    numeroRCS: '',
    numGestion: getLabel('gestion'),
    dateImmatriculation: getDate("Date d'immatriculation"),
    dateDebutActiv: getDate('activit'),
    dateGreffe: '',
    dateRadiation: $(
      'h5:contains("Entreprise radiée le")',
      '#notice-description'
    ).text(),
    dateCessationActivite: getDate("Date de cessation d'activité"),
    denomination: getLabel('Dénomination'),
    dureePersonneMorale: getLabel('Durée de la personne morale'),
    dateClotureExercice: getLabel('Date de clôture'),
    capital: getLabel('Capital social').trim(),
    isPersonneMorale: true,
    libelleNatureJuridique: getLabel('Forme juridique'),
  };
};

export default parseIdentite;
