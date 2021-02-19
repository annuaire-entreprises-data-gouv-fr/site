import getResults from '../clients/sirene-ouverte/recherche';

export interface ISearchResult {
  siren: string;
  siret: string;
  etablissementCount: number;
  mainActivityLabel: string;
  isActive: boolean;
  adress: string;
  latitude: string;
  longitude: string;
  fullName: string;
  path: string;
}

export interface ISearchResults {
  currentPage: number;
  resultCount: number;
  pageCount: number;
  results: ISearchResult[];
}

const search = (searchTerm: string, page: number) => {
  return getResults(searchTerm, page);
};

export default search;
