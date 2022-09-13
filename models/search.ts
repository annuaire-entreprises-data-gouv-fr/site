import { IsLikelyASirenOrSiretException } from '.';
import { HttpNotFound } from '../clients/exceptions';
import getResults from '../clients/sirene-ouverte/recherche';
import { cleanSearchTerm, escapeTerm } from '../utils/helpers/formatting';
import { isLikelyASiretOrSiren } from '../utils/helpers/siren-and-siret';
import logErrorInSentry from '../utils/sentry';
import { EAdministration } from './administrations';
import { APINotRespondingFactory } from './api-not-responding';
import SearchFilterParams from './search-filter-params';

export interface ISearchResult {
  siren: string;
  siret: string;
  nombreEtablissements: number;
  nombreEtablissementsOuverts: number;
  libelleActivitePrincipale: string;
  estActive: boolean;
  adresse: string;
  latitude: number;
  longitude: number;
  nomComplet: string;
  chemin: string;
}

export interface ISearchResults {
  currentPage: number;
  resultCount: number;
  pageCount: number;
  results: ISearchResult[];
}

const search = async (
  searchTerm: string,
  page: number,
  searchFilterParams: SearchFilterParams
) => {
  try {
    const cleanedTerm = cleanSearchTerm(searchTerm);

    const likelyASiretOrSiren = isLikelyASiretOrSiren(cleanedTerm);

    if (likelyASiretOrSiren) {
      throw new IsLikelyASirenOrSiretException(cleanedTerm);
    }

    const escapedSearchTerm = escapeTerm(searchTerm);

    return await getResults(escapedSearchTerm, page, searchFilterParams);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return {
        currentPage: 1,
        resultCount: 0,
        pageCount: 0,
        results: [],
      };
    }
    if (e instanceof IsLikelyASirenOrSiretException) {
      throw e;
    }
    logErrorInSentry('Search API', {
      details: `term : ${searchTerm} - ${e.toString()}`,
    });
    return APINotRespondingFactory(EAdministration.DINUM);
  }
};

export default search;
