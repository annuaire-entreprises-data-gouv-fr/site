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
  siret_siege: string;
  date_creation_siege: string;
  tranche_effectif_salarie_siege: string;
  activite_principale_registre_metier: string;
  numero_voie: string;
  type_voie: string;
  libelle_voie: string;
  code_postal: string;
  libelle_commune: string;
  indice_repetition: string;
  complement_adresse: string;
  commune: string;
  date_debut_activite_siege: string;
  etat_adiministratif_siege: string;
  activite_principale_siege: string;
  longitude: number;
  latitude: number;
  date_creation_unite_legale: string;
  categorie_entreprise: string;
  etat_administratif_unite_legale: string;
  nom_raison_sociale: string;
  nature_juridique_unite_legale: string;
  activite_principale_unite_legale: string;
  economie_sociale_solidaire_unite_legale: string;
  nom_complet: string;
  nombre_etablissements: number;
  nombre_etablissements_ouverts: number;
  is_entrepreneur_individuel: true;
}

export interface ISireneOuverteSearchResults {
  page: string;
  total_results: number;
  total_pages: number;
  currentPage?: string;
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

  if (
    results.length === 0 ||
    !results.results ||
    results.results.length === 0
  ) {
    throw new HttpNotFound('No results');
  }
  return mapToDomainObjectNew(results);
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
        latitude: result.latitude || 0,
        longitude: result.longitude || 0,
        nomComplet: result.nom_complet || 'Nom inconnu',
        nombreEtablissements: result.nombre_etablissements || 1,
        nombreEtablissementsOuverts: result.nombre_etablissements_ouverts || 0,
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
