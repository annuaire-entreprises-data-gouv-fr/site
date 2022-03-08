import * as cheerio from 'cheerio';
import { IIdentite } from '../../../models/dirigeants';
import { Siren } from '../../../utils/helpers/siren-and-siret';
import { formatINPIDateField } from '../../rncs/helper';

// interface htmlObjects {
//   identiteHtml: any;
//   dirigeantsHtml: any;
//   beneficiairesHtml: any;
// }

// const splitHtml = (html: string): htmlObjects => {
//   const $ = cheerio.load(html);
//   const rowCount = $('div.row', '#notice-description').length;
//   const values = {
//     identiteHtml: null,
//     dirigeantsHtml: null,
//     beneficiairesHtml: null,
//   } as htmlObjects;

//   for (let i = 1; i <= rowCount; i++) {
//     const rowHtml = $(
//       `div.row:nth-of-type(${i})`,
//       '#notice-description'
//     ).html();
//     if (rowHtml) {
//       const row = cheerio.load(rowHtml);
//       const h5Title = row('h5').html();
//       if ((h5Title || '').indexOf('Identité') > -1) {
//         values.identiteHtml = row;
//       }
//       if ((h5Title || '').indexOf('Représentants') > -1) {
//         values.dirigeantsHtml = row;
//       }
//     }
//   }
//   return values;
// };

const parseSirenPageHtml = (
  html: string,
  siren: Siren
): {
  // dirigeants: IDirigeant[];
  // beneficiaires: IBeneficiaire[];
  identite: IIdentite;
} => {
  const $ = cheerio.load(html);
  const getLabel = (label: string) =>
    $(`p:contains("${label}")`, '#notice-description').next().first().text();

  console.log(
    $(`p:contains("activit")`, '#notice-description').parent().html()
  );

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
      greffe: 'Paris',
      codeGreffe: '7501',
      numeroRCS: '880 878 145 rcs Paris',
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
  };
};

export default parseSirenPageHtml;
