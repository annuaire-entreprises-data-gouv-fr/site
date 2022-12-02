import { IsLikelyASirenOrSiretException, IUniteLegale } from '.';
import { HttpNotFound } from '../clients/exceptions';
import clientSearchSireneOuverte from '../clients/recherche-entreprise';
import { cleanSearchTerm, escapeTerm } from '../utils/helpers/formatting';
import { isLikelyASiretOrSiren } from '../utils/helpers/siren-and-siret';
import logErrorInSentry from '../utils/sentry';
import { EAdministration } from './administrations';
import { APINotRespondingFactory } from './api-not-responding';
import { IDirigeant } from './immatriculation/rncs';
import SearchFilterParams, { hasSearchParam } from './search-filter-params';

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
