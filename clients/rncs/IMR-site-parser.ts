import * as cheerio from 'cheerio';
import { IBeneficiaire, IDirigeant, IIdentite } from '../../models/dirigeants';
import { formatIntFr } from '../../utils/helpers/formatting';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { formatINPIDateField } from './helper';

const parseSirenPageHtml = (
  html: string,
  siren: Siren
): {
  dirigeants: IDirigeant[];
  beneficiaires: IBeneficiaire[];
  identite: IIdentite;
} => {
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
    identite: {
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
      capital: getLabel('Capital social').split('.')[0] + ' EUR (fixe)',
      isPersonneMorale: true,
      libelleNatureJuridique: getLabel('Forme juridique'),
    },
    dirigeants: [],
    beneficiaires: [],
  };
};

export default parseSirenPageHtml;
