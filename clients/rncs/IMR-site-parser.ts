import * as cheerio from 'cheerio';
import { IBeneficiaire, IDirigeant, IIdentite } from '../../models/dirigeants';
import { Siren } from '../../utils/helpers/siren-and-siret';
import parseBeneficiaires from './site-parsers/beneficiaires';
import parseDirigeants from './site-parsers/dirigeants';
import parseIdentite from './site-parsers/identite';

const parseSirenPageHtml = (
  html: string,
  siren: Siren
): {
  dirigeants: IDirigeant[];
  beneficiaires: IBeneficiaire[];
  identite: IIdentite;
} => {
  const $ = cheerio.load(html);

  const identiteHtml = $(
    `div.row:contains("Identité")`,
    '#notice-description'
  ).html();

  const representantsHtml = $(
    `div.row:contains("Représentants")`,
    '#notice-description'
  ).html();

  const beneficiairesHtml = $(
    `div.row:contains("Bénéficiaires effectifs")`,
    '#notice-description'
  ).html();

  return {
    identite: parseIdentite(identiteHtml || ''),
    dirigeants: parseDirigeants(representantsHtml || ''),
    beneficiaires: parseBeneficiaires(beneficiairesHtml || ''),
  };
};

export default parseSirenPageHtml;
