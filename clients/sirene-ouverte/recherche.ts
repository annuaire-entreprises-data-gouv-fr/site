import { SireneEtalabNotFound } from '.';
import { IEtablissement } from '../../models';
import { ISearchResults } from '../../models/search';
import { parseIntWithDefaultValue } from '../../utils/helpers/formatting';
import { libelleFromCodeNaf } from '../../utils/labels';
import routes from '../routes';

interface ISireneOuverteUniteLegaleResultat {
  siren: string;
  siret: string;
  etablissement_siege: IEtablissement;
  categorie_juridique: string;
  nombre_etablissements: number;
  date_creation: string;
  activite_principale: string;
  etat_administratif_etablissement: string;
  geo_adresse: string;
  latitude: string;
  longitude: string;
  nom_complet: string;
  page_path: string;
}

export interface ISireneOuverteSearchResults {
  page: string;
  total_results: number;
  total_pages: number;
  currentPage?: string;
  unite_legale: ISireneOuverteUniteLegaleResultat[];
}

/**
 * Get results for searchTerms from Sirene ouverte API
 */
const getResults = async (
  searchTerms: string,
  page: number
): Promise<ISearchResults> => {
  const encodedTerms = encodeURI(searchTerms);
  const route = `${routes.sireneOuverte.rechercheUniteLegale}?per_page=10&page=${page}&q=${encodedTerms}`;
  const response = await fetch(route);

  if (response.status === 404) {
    throw new SireneEtalabNotFound(404, 'No results');
  }

  const results = ((await response.json()) ||
    []) as ISireneOuverteSearchResults[];

  // Sirene Ouverte is based on a Postrgres to Rest converter and might return [] instead of 404
  if (
    results.length === 0 ||
    !results[0].unite_legale ||
    results[0].unite_legale.length === 0
  ) {
    throw new SireneEtalabNotFound(404, 'No results');
  }

  return mapToDomainObject(results[0]);
};

const mapToDomainObject = (
  results: ISireneOuverteSearchResults
): ISearchResults => {
  const {
    total_results = 0,
    total_pages = 0,
    unite_legale = [],
    page,
  } = results;

  return {
    currentPage: page ? parseIntWithDefaultValue(page) : 1,
    resultCount: total_results,
    pageCount: total_pages,
    results: unite_legale.map((result: ISireneOuverteUniteLegaleResultat) => {
      return {
        siren: result.siren,
        siret: result.siret,
        estActive: result.etat_administratif_etablissement === 'A',
        adresse: result.geo_adresse,
        latitude: result.latitude,
        longitude: result.longitude,
        nomComplet: result.nom_complet,
        nombreEtablissements: result.nombre_etablissements || 1,
        chemin: result.page_path || result.siren,
        libelleActivitePrincipale: libelleFromCodeNaf(
          result.activite_principale,
          false
        ),
      };
    }),
  };
};

export default getResults;
