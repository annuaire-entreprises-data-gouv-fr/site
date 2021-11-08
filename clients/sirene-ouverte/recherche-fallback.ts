import { ISearchResults } from '../../models/search';
import { httpGet } from '../../utils/network';

export interface IEntrepriseDataSearchResults {
  total_results: number;
  total_pages: number;
  per_page: number;
  page: number;
  etablissement: IResultAtom[];
}

export interface IResultAtom {
  siren: string;
  siret: string;
  libelle_activite_principale_entreprise: string;
  geo_adresse: string;
  latitude: string;
  longitude: string;
  l1_normalisee: string;
}

/**
 * Get results for searchTerms from Sirene ouverte API
 */
const getResultsFallback = async (
  searchTerms: string,
  page: number
): Promise<ISearchResults> => {
  const encodedTerms = encodeURI(searchTerms);
  const route = `https://entreprise.data.gouv.fr/api/sirene/v1/full_text/${encodedTerms}?page=${page}&per_page=10`;
  const response = await httpGet(route);
  const results = (response.data || []) as IEntrepriseDataSearchResults;

  return mapToDomainObject(results);
};

const mapToDomainObject = (
  results: IEntrepriseDataSearchResults
): ISearchResults => {
  const {
    total_results = 0,
    total_pages = 0,
    etablissement = [],
    page,
  } = results;

  return {
    currentPage: page,
    resultCount: total_results,
    pageCount: total_pages,
    results: etablissement.map((result: IResultAtom) => {
      return {
        siren: result.siren,
        siret: result.siret,
        estActive: true,
        adresse: result.geo_adresse,
        latitude: result.latitude,
        longitude: result.longitude,
        nomComplet: result.l1_normalisee || 'Nom inconnu',
        nombreEtablissements: 1,
        chemin: result.siren,
        libelleActivitePrincipale:
          result.libelle_activite_principale_entreprise,
      };
    }),
  };
};

export default getResultsFallback;
