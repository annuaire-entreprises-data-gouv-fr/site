import { HttpBadRequestError, HttpNotFound } from '#clients/exceptions';
import clientSearchRechercheEntreprise from '#clients/recherche-entreprise';
import { IDirigeant } from '#models/immatriculation';
import SearchFilterParams from '#models/search-filter-params';
import {
  cleanSearchTerm,
  escapeTerm,
  isLikelyASiretOrSiren,
} from '#utils/helpers';
import { isIdRnfValid } from '#utils/helpers/id-rnf';
import { isProtectedSiren } from '#utils/helpers/is-protected-siren-or-siret';
import { logWarningInSentry } from '#utils/sentry';
import {
  IEtablissement,
  IUniteLegale,
  IsLikelyASirenOrSiretException,
  IsLikelyAnIdRnfException,
  NotEnoughParamsException,
  SearchEngineError,
} from '.';

export interface ISearchResult extends IUniteLegale {
  nombreEtablissements: number;
  nombreEtablissementsOuverts: number;
  chemin: string;
  matchingEtablissements: IEtablissement[];
  dirigeants: IDirigeant[];
}

export interface ISearchResults {
  currentPage: number;
  resultCount: number;
  pageCount: number;
  results: ISearchResult[];
  notEnoughParams?: boolean;
  badParams?: boolean;
}

const noResults = {
  currentPage: 1,
  resultCount: 0,
  pageCount: 0,
  results: [],
  notEnoughParams: false,
};

/**
 * Checks if term looks like a siren, siret or rnf
 * @param term
 */
const formatChecks = (term: string) => {
  const likelyASiretOrSiren = isLikelyASiretOrSiren(term);

  if (likelyASiretOrSiren) {
    throw new IsLikelyASirenOrSiretException(term);
  }

  const isLikelyAnIdRnf = isIdRnfValid(term);

  if (isLikelyAnIdRnf) {
    throw new IsLikelyAnIdRnfException(term);
  }
};

const search = async (
  searchTerm: string,
  page: number,
  searchFilterParams: SearchFilterParams
) => {
  const cleanedTerm = cleanSearchTerm(searchTerm);

  formatChecks(cleanedTerm);

  try {
    const escapedSearchTerm = escapeTerm(searchTerm);
    return await clientSearchRechercheEntreprise({
      searchTerms: escapedSearchTerm,
      page,
      searchFilterParams,
    });
  } catch (e: any) {
    if (e instanceof HttpBadRequestError) {
      logWarningInSentry('BadParams in API Recherche Entreprise', {
        details: searchFilterParams.toApiURI(),
      });
      return { ...noResults, badParams: true };
    }

    if (
      e instanceof IsLikelyASirenOrSiretException ||
      e instanceof IsLikelyAnIdRnfException
    ) {
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
      return await clientSearchRechercheEntreprise({
        searchTerms: escapedSearchTerm,
        page,
        searchFilterParams,
        fallbackOnStaging: true,
      });
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
