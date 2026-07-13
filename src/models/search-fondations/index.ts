import { HttpBadRequestError, HttpNotFound } from "#/clients/exceptions";
import { clientSearchFondationsRechercheEntreprise } from "#/clients/recherche-entreprise/fondations.server";
import {
  FetchRechercheEntrepriseException,
  NotEnoughParamsException,
} from "#/models/core/types";
import { removeSpecialChars } from "#/utils/helpers";
import { logWarningInSentry } from "#/utils/sentry";
import type { IFondation } from "../core/fondations.types";
import type SearchFondationsFilterParams from "./search-filter-params";

export interface ISearchFondationsResults {
  badParams?: boolean;
  currentPage: number;
  notEnoughParams?: boolean;
  pageCount: number;
  resultCount: number;
  results: IFondation[];
}

const noResults: ISearchFondationsResults = {
  currentPage: 1,
  resultCount: 0,
  pageCount: 0,
  results: [],
  notEnoughParams: false,
};
export const searchFondations = async (
  searchTerm: string,
  page: number,
  searchFilterParams: SearchFondationsFilterParams
) => {
  try {
    const escapedSearchTerm = removeSpecialChars(searchTerm);
    return await clientSearchFondationsRechercheEntreprise({
      searchTerms: escapedSearchTerm,
      pageResultatsRecherche: page,
      searchFilterParams,
    });
  } catch (e: any) {
    if (e instanceof HttpBadRequestError) {
      logWarningInSentry(
        new FetchRechercheEntrepriseException({
          cause: e,
          message: "BadParams in API Recherche Fondations",
          context: {
            details: searchFilterParams.toApiURI(),
          },
        })
      );
      return { ...noResults, badParams: true };
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
      return await clientSearchFondationsRechercheEntreprise({
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
