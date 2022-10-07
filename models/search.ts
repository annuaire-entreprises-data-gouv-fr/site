import {
  IsLikelyASirenOrSiretException,
  NotEnoughSearchParamsException,
} from '.';
import { HttpNotFound } from '../clients/exceptions';
import getResults from '../clients/sirene-ouverte/recherche';
import { cleanSearchTerm, escapeTerm } from '../utils/helpers/formatting';
import { isLikelyASiretOrSiren } from '../utils/helpers/siren-and-siret';
import logErrorInSentry from '../utils/sentry';
import { EAdministration } from './administrations';
import { APINotRespondingFactory } from './api-not-responding';
import SearchFilterParams, { hasSearchParam } from './search-filter-params';

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
  notEnoughParams?: boolean;
}

const noResults = {
  currentPage: 1,
  resultCount: 0,
  pageCount: 0,
  results: [],
  notEnoughParams: false,
};

const search = async (
  searchTerm: string,
  page: number,
  searchFilterParams: SearchFilterParams
) => {
  const cleanedTerm = cleanSearchTerm(searchTerm);

  const hasEnoughParams =
    searchTerm.length >= 2 || hasSearchParam(searchFilterParams.toJSON());

  if (!hasEnoughParams) {
    return { ...noResults, notEnoughParams: true };
  }

  const likelyASiretOrSiren = isLikelyASiretOrSiren(cleanedTerm);

  if (likelyASiretOrSiren) {
    throw new IsLikelyASirenOrSiretException(cleanedTerm);
  }

  try {
    const escapedSearchTerm = escapeTerm(searchTerm);
    return await getResults(escapedSearchTerm, page, searchFilterParams);
  } catch (e: any) {
    if (e instanceof IsLikelyASirenOrSiretException) {
      throw e;
    }
    if (e instanceof HttpNotFound) {
      return noResults;
    }

    // attempt a fallback on staging
    try {
      const escapedSearchTerm = escapeTerm(searchTerm);
      return await getResults(
        escapedSearchTerm,
        page,
        searchFilterParams,
        true
      );
    } catch (eFallback: any) {
      if (eFallback instanceof HttpNotFound) {
        return noResults;
      }

      logErrorInSentry('Search API', {
        details: `term : ${searchTerm} - ${eFallback.toString()}`,
      });

      return APINotRespondingFactory(EAdministration.DINUM);
    }
  }
};

export default search;
