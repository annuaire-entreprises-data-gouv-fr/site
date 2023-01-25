import { HttpNotFound } from '#clients/exceptions';
import clientSearchSireneOuverte from '#clients/recherche-entreprise';
import { IDirigeant } from '#models/immatriculation/rncs';
import SearchFilterParams from '#models/search-filter-params';
import {
  cleanSearchTerm,
  escapeTerm,
  isLikelyASiretOrSiren,
} from '#utils/helpers';
import { isProtectedSiren } from '#utils/helpers/is-protected-siren-or-siret';
import {
  IsLikelyASirenOrSiretException,
  IUniteLegale,
  NotEnoughParamsException,
  SearchEngineError,
} from '.';

export interface ISearchResult extends IUniteLegale {
  nombreEtablissements: number;
  nombreEtablissementsOuverts: number;
  chemin: string;
  dirigeants: IDirigeant[];
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
  const likelyASiretOrSiren = isLikelyASiretOrSiren(cleanedTerm);

  if (likelyASiretOrSiren) {
    throw new IsLikelyASirenOrSiretException(cleanedTerm);
  }

  try {
    const escapedSearchTerm = escapeTerm(searchTerm);
    return await clientSearchSireneOuverte(
      escapedSearchTerm,
      page,
      searchFilterParams
    );
  } catch (e: any) {
    if (e instanceof IsLikelyASirenOrSiretException) {
      throw e;
    }
    if (e instanceof HttpNotFound) {
      return noResults;
    }
    if (e instanceof NotEnoughParamsException) {
      return { ...noResults, notEnoughParams: true };
    }

    // attempt a fallback on staging
    try {
      const escapedSearchTerm = escapeTerm(searchTerm);
      return await clientSearchSireneOuverte(
        escapedSearchTerm,
        page,
        searchFilterParams,
        true
      );
    } catch (eFallback: any) {
      if (eFallback instanceof HttpNotFound) {
        return noResults;
      }

      throw new SearchEngineError(
        `term : ${searchTerm} - ${eFallback.toString()}`
      );
    }
  }
};

/**
 * Research a search query but remove any protected Siren from result list
 * @param searchTerm
 * @param page
 * @param searchFilterParams
 * @returns
 */
export const searchWithoutProtectedSiren = async (
  searchTerm: string,
  page: number,
  searchFilterParams: SearchFilterParams
) => {
  const results = await search(searchTerm, page, searchFilterParams);

  results.results = results.results.filter((result) => {
    if (isProtectedSiren(result.siren)) {
      results.resultCount -= 1;
      return false;
    }
    return true;
  });

  return results;
};
