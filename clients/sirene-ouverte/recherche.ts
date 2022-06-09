import { ISearchResults } from '../../models/search';
import constants from '../../models/constants';
import {
  formatAdresse,
  parseIntWithDefaultValue,
} from '../../utils/helpers/formatting';
import { libelleFromCodeNaf } from '../../utils/labels';
import { httpGet } from '../../utils/network';
import { HttpNotFound } from '../exceptions';
import routes from '../routes';
import SearchFilterParams from '../../models/search-filter-params';

interface ISireneOuverteUniteLegaleResultat {
  siren: string;
  siege: {
    siret: string;
    date_creation: string;
    tranche_effectif_salarie: string;
    date_debut_activite: string;
    etat_adiministratif: string;
    activite_principale: string;
    numero_voie: string;
    type_voie: string;
    libelle_voie: string;
    code_postal: string;
    libelle_commune: string;
    indice_repetition: string;
    complement_adresse: string;
    commune: string;
    longitude: number;
    latitude: number;
    activite_principale_registre_metier: string;
  };
  date_creation: string;
  categorie_entreprise: string;
  etat_administratif: string;
  nom_raison_sociale: string;
  nature_juridique: string;
  activite_principale: string;
  economie_sociale_solidaire: string;
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
  page: number,
  searchFilterParams?: SearchFilterParams
): Promise<ISearchResults> => {
  const encodedTerms = encodeURI(searchTerms);

  const route =
    process.env.ALTERNATIVE_SEARCH_ROUTE ||
    routes.sireneOuverte.rechercheUniteLegale;

  let url = `${route}?per_page=10&page=${page}&q=${encodedTerms}${
    searchFilterParams?.toURI() || ''
  }`;

  const response = await httpGet(url, { timeout: constants.timeout.long });

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
        siret: result.siege.siret,
        estActive: result.etat_administratif === 'A',
        adresse: formatAdresse(
          result.siege.complement_adresse || '',
          result.siege.numero_voie,
          result.siege.indice_repetition,
          result.siege.type_voie,
          result.siege.libelle_voie,
          result.siege.code_postal,
          result.siege.libelle_commune
        ),
        latitude: result.siege.latitude || 0,
        longitude: result.siege.longitude || 0,
        nomComplet: result.nom_complet || 'Nom inconnu',
        nombreEtablissements: result.nombre_etablissements || 1,
        nombreEtablissementsOuverts: result.nombre_etablissements_ouverts || 0,
        chemin: result.siren,
        libelleActivitePrincipale: libelleFromCodeNaf(
          result.activite_principale,
          false
        ),
      };
    }),
  };
};

export default getResults;
