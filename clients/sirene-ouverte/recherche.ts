import { IEtablissement } from '../../models';
import { ISearchResults } from '../../models/search';
import {
  formatAdresse,
  parseIntWithDefaultValue,
} from '../../utils/helpers/formatting';
import { libelleFromCodeNaf } from '../../utils/labels';
import { httpGet } from '../../utils/network';
import { HttpNotFound } from '../exceptions';
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
  etat_administratif_unite_legale: string;
  latitude: string;
  longitude: string;
  nom_complet: string;
  page_path: string;
  complement_adresse: string;
  numero_voie: string;
  indice_repetition: string;
  type_voie: string;
  libelle_commune: string;
  code_postal: string;
  libelle_voie: string;
  // new fields
  siret_siege: string;
  tranche_effectif_salarie_siege: string;
  commune: string;
  date_debut_activite: string;
  etat_administratif_siege: string;
  activite_principale_siege: string;
  date_creation_unite_legale: string;
  tranche_effectif_salarie_unite_legale: string;
  date_mise_a_jour: string;
  categorie_entreprise: string;
  nom_raison_sociale: string;
  nature_juridique_unite_legale: string;
  activite_principale_unite_legale: string;
  nombre_etablissements_ouverts: string;
  is_entrepreneur_individuel: string;
}

export interface ISireneOuverteSearchResults {
  page: string;
  total_results: number;
  total_pages: number;
  currentPage?: string;
  unite_legale: ISireneOuverteUniteLegaleResultat[];
  // new fields
  results: ISireneOuverteUniteLegaleResultat[];
}

/**
 * Get results for searchTerms from Sirene ouverte API
 */
const getResults = async (
  searchTerms: string,
  page: number
): Promise<ISearchResults> => {
  const encodedTerms = encodeURI(searchTerms);

  const route =
    process.env.ALTERNATIVE_SEARCH_ROUTE ||
    routes.sireneOuverte.rechercheUniteLegale;

  const url = `${route}?per_page=10&page=${page}&q=${encodedTerms}`;
  const response = await httpGet(url);

  const results = (response.data || []) as any;

  // Sirene Ouverte is based on a Postrgres to Rest converter and might return [] instead of 404
  try {
    if (
      results.length === 0 ||
      !results[0].unite_legale ||
      results[0].unite_legale.length === 0
    ) {
      throw new HttpNotFound('No results');
    }
    return mapToDomainObject(results[0]);
  } catch {
    if (
      results.length === 0 ||
      !results.results ||
      results.results.length === 0
    ) {
      throw new HttpNotFound('No results');
    }
    return mapToDomainObjectNew(results);
  }
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
        estActive: result.etat_administratif_unite_legale === 'A',
        adresse: formatAdresse(
          result.complement_adresse || '',
          result.numero_voie,
          result.indice_repetition,
          result.type_voie,
          result.libelle_voie,
          result.code_postal,
          result.libelle_commune
        ),
        latitude: result.latitude || '',
        longitude: result.longitude || '',
        nomComplet: result.nom_complet || 'Nom inconnu',
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

const mapToDomainObjectNew = (
  data: ISireneOuverteSearchResults
): ISearchResults => {
  const { total_results = 0, total_pages = 0, results = [], page } = data;

  return {
    currentPage: page ? parseIntWithDefaultValue(page) : 1,
    resultCount: total_results,
    pageCount: total_pages,
    results: results.map((result: ISireneOuverteUniteLegaleResultat) => {
      return {
        siren: result.siren,
        siret: result.siret_siege,
        estActive: result.etat_administratif_unite_legale === 'A',
        adresse: formatAdresse(
          result.complement_adresse || '',
          result.numero_voie,
          result.indice_repetition,
          result.type_voie,
          result.libelle_voie,
          result.code_postal,
          result.libelle_commune
        ),
        latitude: result.latitude || '',
        longitude: result.longitude || '',
        nomComplet: result.nom_raison_sociale || 'Nom inconnu',
        nombreEtablissements: result.nombre_etablissements || 1,
        nombreEtablissementsOuverts: result.nombre_etablissements_ouverts || 1,
        chemin: result.page_path || result.siren,
        libelleActivitePrincipale: libelleFromCodeNaf(
          result.activite_principale_unite_legale,
          false
        ),
      };
    }),
  };
};

export default getResults;
