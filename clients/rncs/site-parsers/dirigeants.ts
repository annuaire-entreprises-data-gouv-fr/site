import * as cheerio from 'cheerio';
import { IEtatCivil, IPersonneMorale } from '../../../models/dirigeants';

const parseDirigeants = (html: string) => {
  const $ = cheerio.load(html);

  const humanDirigeants = [] as IEtatCivil[];
  const companyDirigeants = [] as IPersonneMorale[];

  $('div.col-12.col-md-4').each(function (index, element) {
    if ($(element).attr('class') === 'col-12  col-md-4 ') {
      const names = $(`p:contains("Nom, Prénom")`, element);
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

        humanDirigeants.push({
          nom: full[0],
          prenom: '',
          sexe: null,
          dateNaissance: '',
          lieuNaissance: '',
          role: full[1],
        });
        return;
      }

      const lastIdx = humanDirigeants.length - 1;
      const usualName = $(`p:contains("Nom d'usage")`, element);
      if (usualName.length > 0) {
        const usual = usualName.next().first().text().trim();
        humanDirigeants[
          lastIdx
        ].nom = `${usual} (${humanDirigeants[lastIdx].nom})`;
        return;
      }

      const birth = $(`p:contains("Date de naissance (mm/aaaa)")`, element);
      if (birth.length > 0) {
        const birthDate = birth.next().first().text().trim();
        humanDirigeants[lastIdx].dateNaissance = birthDate;
        return;
      }

      const denomination = $(`p:contains("Dénomination")`, element);
      if (denomination.length > 0) {
        const companyName = denomination
          .next()
          .first()
          .text()
          .replace(/\s+/g, ' ')
          .trim()
          .replace(')', '')
          .split('(');

        companyDirigeants.push({
          denomination: companyName[0],
          siren: '',
          natureJuridique: '',
          role: companyName[1],
        });
      }
    }
  });

  return [...companyDirigeants, ...humanDirigeants];
};

export default parseDirigeants;
