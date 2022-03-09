import * as cheerio from 'cheerio';
import { IBeneficiaire } from '../../../models/dirigeants';

const parseBeneficiaires = (html: string) => {
  const $ = cheerio.load(html);

  const beneficiaires = [] as IBeneficiaire[];

  $('div.col-md-6').each(function (index, element) {
    const names = $(`p:contains("Nom prénom")`, element);
    if (names.length > 0) {
      const full = names
        .next()
        .first()
        .text()
        .replace('\n', '')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(')', '')
        .split('(');

      beneficiaires.push({
        nom: full[0],
        prenoms: '',
        nationalite: '',
        dateNaissance: '',
        type: '',
        dateGreffe: '',
      });
      return;
    }

    const lastIdx = beneficiaires.length - 1;
    const country = $(`p:contains("Nationalité")`, element);
    if (country.length > 0) {
      beneficiaires[lastIdx].nationalite = country.next().first().text().trim();
      return;
    }

    const birth = $(`p:contains("Date de naissance (mm/aaaa)")`, element);
    if (birth.length > 0) {
      beneficiaires[lastIdx].dateNaissance = birth.next().first().text().trim();
      return;
    }
  });

  return beneficiaires;
};

export default parseBeneficiaires;
