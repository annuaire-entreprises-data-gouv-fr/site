import constants from "#/models/constants";
import type { IFondation } from "#/models/core/fondations.types";
import { NotEnoughParamsException } from "#/models/core/types";
import type { ISearchFondationsResults } from "#/models/search-fondations";
import type SearchFondationsFilterParams from "#/models/search-fondations/search-filter-params";
import { httpGet } from "#/utils/network";
import { parseIntWithDefaultValue } from "../../utils/helpers/formatting/formatting";
import routes from "../routes";
import type { IFondationResult, ISearchFondationsResponse } from "./interface";

interface ClientFondationsRechercheEntreprise {
  pageResultatsRecherche?: number;
  searchFilterParams?: SearchFondationsFilterParams;
  searchTerms: string;
}

export const clientSearchFondationsRechercheEntreprise = async (
  {
    searchTerms,
    pageResultatsRecherche = 1,
    searchFilterParams,
  }: ClientFondationsRechercheEntreprise,
  signal?: AbortSignal
): Promise<ISearchFondationsResults> => {
  const encodedTerms = encodeURIComponent(searchTerms);

  const filters = searchFilterParams?.toApiURI();

  if (!filters && (!encodedTerms || encodedTerms.length < 3)) {
    throw new NotEnoughParamsException();
  }

  const route = `${process.env.API_RECHERCHE_ENTREPRISE_URL}${routes.rechercheEntreprise.rechercheFondations}`;

  const url = `${route}?per_page=10&page=${pageResultatsRecherche}&q=${encodedTerms}&limite_matching_etablissements=3&mtm_campaign=annuaire-entreprises-site${
    searchFilterParams?.toApiURI() || ""
  }`;

  const timeout = constants.timeout.L;

  const response = await httpGet<ISearchFondationsResponse>(url, {
    timeout,
    headers: { referer: "annuaire-entreprises-site" },
    signal,
  });

  return mapToDomainObject(response);
};

const mapToDomainObject = (
  response: ISearchFondationsResponse
): ISearchFondationsResults => {
  const { total_results = 0, total_pages = 0, results = [], page } = response;

  return {
    currentPage: parseIntWithDefaultValue(page as string, 1),
    resultCount: total_results,
    pageCount: total_pages,
    results: results.map((r) => mapToFondationResult(r)),
  };
};

const mapToFondationResult = (result: IFondationResult): IFondation => ({
  address: result.adresse,
  creationDate: result.date_creation,
  department: null,
  foundationType: result.type_organisme,
  generalInterestDomain: null,
  hasInternationalActivity: null,
  id: result.numero_rnf,
  postalCode: result.code_postal,
  siret: result.siret,
  socialObject: null,
  state: null,
  stateEffectiveAt: null,
  title: result.titre,
});
