import { IsASirenException } from '.';
import { HttpNotFound } from '../clients/exceptions';
import getResults from '../clients/sirene-ouverte/recherche';
import { cleanSearchTerm, escapeTerm } from '../utils/helpers/formatting';
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

const search = async (searchTerm: string, page: number) => {
  try {
    const cleanedTerm = cleanSearchTerm(searchTerm);

    const isAValidSirenOrSiret = isSirenOrSiret(cleanedTerm);

    if (isAValidSirenOrSiret) {
      throw new IsASirenException(cleanedTerm);
    }

    const escapedSearchTerm = escapeTerm(searchTerm);
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
