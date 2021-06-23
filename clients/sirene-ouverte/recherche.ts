import { IEtablissement } from '../../models';
import { ISearchResults } from '../../models/search';
import { parseIntWithDefaultValue } from '../../utils/helpers/formatting';
import { formatAdresse, libelleFromCodeNaf } from '../../utils/labels';
import { httpGet } from '../../utils/network/http';
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
  latitude: string;
  longitude: string;
  nom_complet: string;
  page_path: string;
  numero_voie: string;
  indice_repetition: string;
  type_voie: string;
  libelle_commune: string;
  code_postal: string;
  libelle_voie: string;
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
  const response = await httpGet(route);

  const results = (response.data || []) as ISireneOuverteSearchResults[];

  // Sirene Ouverte is based on a Postrgres to Rest converter and might return [] instead of 404
  if (
    results.length === 0 ||
    !results[0].unite_legale ||
    results[0].unite_legale.length === 0
  ) {
    throw new HttpNotFound(404, 'No results');
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
        adresse: formatAdresse(
          result.numero_voie,
          result.indice_repetition,
          result.type_voie,
          result.libelle_voie,
          result.code_postal,
          result.libelle_commune
        ),
        latitude: result.latitude,
        longitude: result.longitude,
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

export default getResults;
