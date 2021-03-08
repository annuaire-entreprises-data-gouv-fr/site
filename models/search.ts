import { IsASirenException } from '.';
import { HttpNotFound } from '../clients/exceptions';
import getResults from '../clients/sirene-ouverte/recherche';
import {
  escapeTerm,
  removeInvisibleChar,
  trimWhitespace,
} from '../utils/helpers/formatting';
import { isSirenOrSiret } from '../utils/helpers/siren-and-siret';

export interface ISearchResult {
  siren: string;
  siret: string;
  nombreEtablissements: number;
  libelleActivitePrincipale: string;
  estActive: boolean;
  adresse: string;
  latitude: string;
  longitude: string;
  nomComplet: string;
  chemin: string;
}

export interface ISearchResults {
  currentPage: number;
  resultCount: number;
  pageCount: number;
  results: ISearchResult[];
}

const search = async (searchTerms: string, page: number) => {
  try {
    // Removes invisible characters one might copy paste without knowing
    const cleanedTerm = removeInvisibleChar(searchTerms);

    // Redirects when user copy/pasted a siret or a siren
    const trimmedTerm = trimWhitespace(cleanedTerm);

    const isAValidSirenOrSiret = isSirenOrSiret(trimmedTerm);

    if (isAValidSirenOrSiret) {
      throw new IsASirenException(trimmedTerm);
    }

    const escapedSearchTerm = escapeTerm(searchTerms);
    return await getResults(escapedSearchTerm, page);
  } catch (e) {
    if (e instanceof HttpNotFound) {
      return [];
    } else {
      throw e;
    }
  }
};

export default search;
