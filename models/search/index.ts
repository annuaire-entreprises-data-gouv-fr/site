import { HttpBadRequestError, HttpNotFound } from '#clients/exceptions';
import clientSearchRechercheEntreprise from '#clients/recherche-entreprise';
import {
  FetchRechercheEntrepriseException,
  IEtablissement,
  IUniteLegale,
  IsLikelyASirenOrSiretException,
  NotEnoughParamsException,
} from '#models/core/types';
import { Exception } from '#models/exceptions';
import { IDirigeants } from '#models/rne/types';
import SearchFilterParams from '#models/search/search-filter-params';
import {
  formatMonthIntervalFromPartialDate,
  removeSpecialChars,
} from '#utils/helpers';
import { isProtectedSiren } from '#utils/helpers/is-protected-siren-or-siret';
import { logWarningInSentry } from '#utils/sentry';
import { isPersonneMorale } from 'app/(header-default)/dirigeants/[slug]/_component/sections/is-personne-morale';

export interface ISearchResult extends IUniteLegale {
  nombreEtablissements: number;
  nombreEtablissementsOuverts: number;
  chemin: string;
  matchingEtablissements: IEtablissement[];
  dirigeants: IDirigeants['data'];
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
const search = async (
  searchTerm: string,
  page: number,
  searchFilterParams: SearchFilterParams
) => {
  try {
    const escapedSearchTerm = removeSpecialChars(searchTerm);
    return await clientSearchRechercheEntreprise({
      searchTerms: escapedSearchTerm,
      pageResultatsRecherche: page,
      searchFilterParams,
    });
  } catch (e: any) {
    if (e instanceof HttpBadRequestError) {
      logWarningInSentry(
        new FetchRechercheEntrepriseException({
          cause: e,
          message: 'BadParams in API Recherche Entreprise',
          context: {
            details: searchFilterParams.toApiURI(),
          },
        })
      );
      return { ...noResults, badParams: true };
    }

    if (e instanceof IsLikelyASirenOrSiretException) {
      throw e;
    }
    if (e instanceof HttpNotFound) {
      return noResults;
    }
    if (e instanceof NotEnoughParamsException) {
      return { ...noResults, notEnoughParams: true };
    }

    // retry
    try {
      const escapedSearchTerm = removeSpecialChars(searchTerm);
      return await clientSearchRechercheEntreprise({
        searchTerms: escapedSearchTerm,
        pageResultatsRecherche: page,
        searchFilterParams,
      });
    } catch (eFallback: any) {
      if (eFallback instanceof HttpNotFound) {
        return noResults;
      }
      throw new FetchRechercheEntrepriseException({
        cause: eFallback,
        context: {
          details: searchTerm,
        },
      });
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
): Promise<ISearchResults> => {
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

/**
 * Research a personn's companies
 *
 * @param name
 * @param firstName
 * @param partialDate
 * @param sirenFrom
 * @param page
 * @returns
 */
export const searchPersonCompanies = async (
  name: string,
  prenom: string,
  prenoms: string,
  partialDate: string,
  sirenFrom: string,
  page: number
): Promise<ISearchResults> => {
  const monthInterval = formatMonthIntervalFromPartialDate(partialDate);

  const [dmin, dmax] =
    typeof monthInterval === 'string' ? ['', ''] : monthInterval;

  if (!dmin || !dmax) {
    logWarningInSentry(
      new Exception({
        name: 'SearchDirigeantBadParams',
        message: 'No date bounds in page personne',
        context: {
          siren: sirenFrom,
        },
      })
    );
    return {
      results: [],
      resultCount: 0,
      currentPage: 1,
      pageCount: 1,
    };
  }
  // search with only first firstName
  const searchFilterParams = new SearchFilterParams({
    n: name,
    fn: prenom,
    dmin,
    dmax,
  });

  const results = await searchWithoutProtectedSiren(
    '',
    page,
    searchFilterParams
  );

  results.results = results.results.filter((result) => {
    // only one firstname
    if (prenoms === prenom) {
      return true;
    }

    // return either exact match on all firstnames match prenoms or the structures with only one first name matching prenom
    const hasFirstNames = result.dirigeants.find(
      (d) =>
        !isPersonneMorale(d) && (d.prenoms === prenoms || d.prenoms === prenom)
    );
    if (hasFirstNames) {
      return true;
    } else {
      results.resultCount -= 1;
      return false;
    }
  });

  return results;
};
