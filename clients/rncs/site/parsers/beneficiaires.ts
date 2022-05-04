import { IBeneficiaire } from '../../../../models/immatriculation/rncs';
import {
  capitalize,
  formatFirstNames,
  formatNameFull,
} from '../../../../utils/helpers/formatting';
import { extractFromHtmlBlock, parseNameAndRole } from './helpers';

const parseBeneficiaires = (beneficiairesHtml: Element) => {
  const beneficiaires = [] as IBeneficiaire[];

  // parse each sub section and look for a dirigeant
  const blocsHtml = beneficiairesHtml.querySelectorAll('div.col-12.row.mt-4');

  for (var i = 0; i < blocsHtml.length; i++) {
    // every dirigeant is composed of three blocks
    const currentBeneficiaireBlock = blocsHtml[i].querySelectorAll(
      'div.bloc-detail-notice'
    );

    const parsedBlocs = {} as any;

    for (var j = 0; j < currentBeneficiaireBlock.length; j++) {
      const { label, text } = extractFromHtmlBlock(currentBeneficiaireBlock[j]);
      parsedBlocs[label] = text;
    }

    // let s assume Name is always first
    const { nom, prenom } = parseNameAndRole(parsedBlocs['Nom prénom'] || '');

    beneficiaires.push({
      type: '',
      nom: nom,
      prenoms: prenom,
      dateNaissance: parsedBlocs['Date de naissance (mm/aaaa)'] || '',
      nationalite: capitalize(parsedBlocs['Nationalité'] || ''),
      dateGreffe: '',
    });
  }
  return beneficiaires;
};

export default parseBeneficiaires;
