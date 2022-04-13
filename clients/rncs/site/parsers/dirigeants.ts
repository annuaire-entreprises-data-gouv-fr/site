import {
  IEtatCivil,
  IPersonneMorale,
} from '../../../../models/immatriculation/rncs';
import {
  formatFirstNames,
  formatNameFull,
} from '../../../../utils/helpers/formatting';
import {
  cleanTextFromHtml,
  extractFromHtmlBlock,
  parseNameAndRole,
} from './helpers';

const parseDirigeants = (dirigeantsHtml: Element) => {
  const dirigeants = [] as (IEtatCivil | IPersonneMorale)[];

  // parse each sub section and look for a dirigeant
  const blocsHtml = dirigeantsHtml.querySelectorAll('div.col-12.col-md-4');

  for (var i = 0; i < blocsHtml.length; i += 3) {
    // every dirigeant is composed of three blocks
    const firstBloc = extractFromHtmlBlock(blocsHtml[i]);
    const secondBloc = extractFromHtmlBlock(blocsHtml[i + 1]);
    const thirdBloc = extractFromHtmlBlock(blocsHtml[i + 2]);

    if (firstBloc.label === 'Dénomination') {
      // personne morale
      const companyName = cleanTextFromHtml(firstBloc.text).split('(');
      const denomination = companyName[0] || '';
      const role = companyName[1].replace(')', '') || '';

      dirigeants.push({
        denomination,
        siren: '',
        natureJuridique: '',
        role,
      });
    } else {
      // personne physique
      const { nom, prenom, role } = parseNameAndRole(firstBloc.text);
      const dateNaissance = thirdBloc.text.trim();
      const nomComplet = secondBloc.label ? `${nom} (${secondBloc.text})` : nom;

      dirigeants.push({
        nom: nomComplet,
        prenom: prenom,
        role,
        sexe: null,
        dateNaissance,
        lieuNaissance: '',
      });
    }
  }
  return dirigeants;
};

export default parseDirigeants;
