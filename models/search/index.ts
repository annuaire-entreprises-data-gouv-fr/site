import { HttpBadRequestError, HttpNotFound } from "#clients/exceptions";
import clientSearchRechercheEntreprise from "#clients/recherche-entreprise";
import { anonymiseUniteLegale, ISTATUTDIFFUSION } from "#models/core/diffusion";
import {
  FetchRechercheEntrepriseException,
  type IEtablissement,
  IsLikelyASirenOrSiretException,
  type IUniteLegale,
  isPersonnePhysique,
  NotEnoughParamsException,
} from "#models/core/types";
import { Exception } from "#models/exceptions";
import { isProtectedSiren } from "#models/protected-siren";
import type { IDirigeants } from "#models/rne/types";
import SearchFilterParams from "#models/search/search-filter-params";
import {
  formatMonthIntervalFromPartialDate,
  removeSpecialChars,
} from "#utils/helpers";
import { isPersonneMorale } from "#utils/helpers/is-personne-morale";
import { logWarningInSentry } from "#utils/sentry";
import getSession from "#utils/server-side-helper/get-session";

export interface ISearchResult extends IUniteLegale {
  nombreEtablissements: number;
  nombreEtablissementsOuverts: number;
  chemin: string;
  matchingEtablissements: IEtablissement[];
  dirigeants: IDirigeants;
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
          message: "BadParams in API Recherche Entreprise",
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
 * Research a search query but remove any protected personne physique from result list
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
  const session = await getSession();
  const results = await search(searchTerm, page, searchFilterParams);
  const newResults: ISearchResult[] = [];

  for (let i = 0; i < results.results.length; i++) {
    const currentResult = results.results[i];
    const isProtected = await isProtectedSiren(currentResult.siren);

    if (isProtected && isPersonnePhysique(currentResult)) {
      results.resultCount -= 1;
    } else {
      if (isProtected) {
        currentResult.statutDiffusion = ISTATUTDIFFUSION.PROTECTED;
        currentResult.siege.statutDiffusion = ISTATUTDIFFUSION.PROTECTED;
        currentResult.matchingEtablissements.forEach((etablissement) => {
          etablissement.statutDiffusion = ISTATUTDIFFUSION.PROTECTED;
        });
      }

      newResults.push(anonymiseUniteLegale(currentResult, session));
    }
  }

  results.results = newResults;
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
    typeof monthInterval === "string" ? ["", ""] : monthInterval;

  if (!dmin || !dmax) {
    logWarningInSentry(
      new Exception({
        name: "SearchDirigeantBadParams",
        message: "No date bounds in page personne",
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
    "",
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
    }
    results.resultCount -= 1;
    return false;
  });

  return results;
};
