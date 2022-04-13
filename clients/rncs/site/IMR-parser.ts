import { JSDOM } from 'jsdom';

import {
  IBeneficiaire,
  IDirigeant,
  IIdentite,
} from '../../../models/immatriculation/rncs';
import { Siren } from '../../../utils/helpers/siren-and-siret';
import { InvalidFormatError } from '../api/IMR-parser';
import parseBeneficiaires from './parsers/beneficiaires';
import parseDirigeants from './parsers/dirigeants';
import parseIdentite, {
  extractDirigeantFromIdentite,
} from './parsers/identite';

const clean = (raw = '') => raw.replace('\n', '').replace(/\s+/g, ' ').trim();

const extractIMRFromHtml = (
  html: string,
  siren: Siren
): {
  dirigeants: IDirigeant[];
  beneficiaires: IBeneficiaire[];
  identite: IIdentite;
} => {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const container = document.querySelector(
    'div#notice-description > div.bloc-without-img'
  );

  if (!container) {
    throw new InvalidFormatError('Cannot find Inpi container');
  }

  const rowsHtml = container.querySelectorAll('div.row');

  const response = {
    identite: null,
    dirigeants: [],
    beneficiaires: [],
  } as any;

  let rawIdentite;

  const radiationText =
    container.querySelector('p.company-removed')?.textContent || '';

  for (var i = 0; i < rowsHtml.length; i++) {
    const row = rowsHtml[i];
    const title = clean(row.querySelector('h5')?.innerHTML);

    switch (title) {
      case 'Identité':
        response.identite = parseIdentite(row, radiationText);
        rawIdentite = row;
      case 'Représentants':
        response.dirigeants = parseDirigeants(row);
      case 'Bénéficiaires effectifs':
        response.beneficiaires = parseBeneficiaires(row);
      default:
    }
  }

  // EI
  if (
    response.dirigeants.length === 0 &&
    response.identite.isPersonneMorale === false &&
    rawIdentite
  ) {
    response.dirigeants = [extractDirigeantFromIdentite(rawIdentite)];
  }

  return response;
};

export { extractIMRFromHtml };
