import { HttpNotFound } from '#clients/exceptions';
import clientSearchSireneOuverte from '#clients/recherche-entreprise';
import { EAdministration } from '#models/administrations';
import { APINotRespondingFactory } from '#models/api-not-responding';
import { IDirigeant } from '#models/immatriculation/rncs';
import SearchFilterParams, {
  hasSearchParam,
} from '#models/search-filter-params';
import {
  cleanSearchTerm,
  escapeTerm,
  isLikelyASiretOrSiren,
} from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { IsLikelyASirenOrSiretException, IUniteLegale } from '.';

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

export default search;
