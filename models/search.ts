import { HttpNotFound } from '#clients/exceptions';
import clientSearchSireneOuverte from '#clients/recherche-entreprise';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IDirigeant } from '#models/immatriculation/rncs';
import SearchFilterParams, {
  hasSearchParam,
} from '#models/search-filter-params';
import {
  cleanSearchTerm,
  escapeTerm,
  isLikelyASiretOrSiren,
} from '#utils/helpers';
import { isProtectedSiren } from '#utils/helpers/is-protected-siren-or-siret';
import logErrorInSentry from '#utils/sentry';
import {
  IEtablissement,
  IsLikelyASirenOrSiretException,
  IUniteLegale,
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

  const notEnoughParams =
    searchTerm.length < 3 && !hasSearchParam(searchFilterParams.toJSON());

  if (notEnoughParams) {
    return { ...noResults, notEnoughParams: true };
  }

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

      logErrorInSentry('Search API', {
        details: `term : ${searchTerm} - ${eFallback.toString()}`,
      });

      return APINotRespondingFactory(EAdministration.DINUM);
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
const searchWithoutProtectedSiren = async (
  searchTerm: string,
  page: number,
  searchFilterParams: SearchFilterParams
) => {
  const results = await search(searchTerm, page, searchFilterParams);

  if (isAPINotResponding(results)) {
    return results;
  }

  results.results = results.results.filter((result) => {
    if (isProtectedSiren(result.siren)) {
      results.resultCount -= 1;
      return false;
    }
    return true;
  });

  return results;
};

export default searchWithoutProtectedSiren;
