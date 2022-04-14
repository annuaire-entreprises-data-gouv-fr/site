import { IsLikelyASirenOrSiretException } from '.';
import { HttpNotFound } from '../clients/exceptions';
import getResults from '../clients/sirene-ouverte/recherche';
// import getResultsFallback from '../clients/sirene-ouverte/recherche-fallback';
import { cleanSearchTerm, escapeTerm } from '../utils/helpers/formatting';
import { isLikelyASiretOrSiren } from '../utils/helpers/siren-and-siret';
import logErrorInSentry from '../utils/sentry';
import { EAdministration } from './administration';
import {
  APINotRespondingFactory,
  isAPINotResponding,
} from './api-not-responding';

export interface ISearchResult {
  siren: string;
  siret: string;
  nombreEtablissements: number;
  libelleActivitePrincipale: string;
  estActive: boolean;
  adresse: string;
  latitude: string;
  longitude: string;
  nomComplet: string;
  chemin: string;
}

export interface ISearchResults {
  currentPage: number;
  resultCount: number;
  pageCount: number;
  results: ISearchResult[];
}

const search = async (searchTerm: string, page: number) => {
  try {
    const cleanedTerm = cleanSearchTerm(searchTerm);

    const likelyASiretOrSiren = isLikelyASiretOrSiren(cleanedTerm);

    if (likelyASiretOrSiren) {
      throw new IsLikelyASirenOrSiretException(cleanedTerm);
    }

    const escapedSearchTerm = escapeTerm(searchTerm);

    const results = await getResults(escapedSearchTerm, page);
    // const results = await getResultsFallback(escapedSearchTerm, page);
    return results;
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return {
        currentPage: 1,
        resultCount: 0,
        pageCount: 0,
        results: [],
      };
    } else {
      logErrorInSentry('Search API', { details: e.toString() });
      return APINotRespondingFactory(EAdministration.DINUM);
    }
  }
};

export default search;
