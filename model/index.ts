import { generatePagePath } from '../utils/formatting';
import { isSirenOrSiret, libelleFromCodeNaf } from '../utils/helper';
import logErrorInSentry from '../utils/sentry';
import routes, {
  getSearchUniteLegaleRoute,
  getUniteLegaleRoute,
} from './routes';

export interface Etablissement {
  siren: string;
  siret: string;
  nic: string;
  etat_administratif: 'A' | null;
  date_creation: string;
  geo_adresse: string;
  etablissement_siege: string;
  activite_principale: string;
  date_dernier_traitement: string;
  libelle_activite_principale: string;
  is_siege: '1' | null;
  tranche_effectifs: string;
  latitude: string;
  longitude: string;
}

export interface UniteLegale {
  siren: string;
  etablissement_siege: Etablissement;
  categorie_juridique: string;
  etablissements: Etablissement[];
  date_creation: string;
  statut_diffusion: string;
  nom_complet: string;
  page_path: string;
}

export interface ResultUniteLegale {
  siren: string;
  siret: string;
  etablissement_siege: Etablissement;
  categorie_juridique: string;
  nombre_etablissements: number;
  date_creation: string;
  libelle_activite_principale: string;
  etat_administratif_etablissement: string;
  geo_adresse: string;
  latitude: string;
  longitude: string;
  nom_complet: string;
  page_path: string;
}

export interface SearchResults {
  page: string;
  total_results: number;
  total_pages: number;
  unite_legale: ResultUniteLegale[];
}

const getUniteLegale = async (
  siren: string
): Promise<UniteLegale | undefined> => {
  if (!isSirenOrSiret(siren)) {
    throw new Error(`Ceci n'est pas un numéro SIREN valide : ${siren}`);
  }
  const response = await fetch(getUniteLegaleRoute(siren));
  if (response.status === 404) {
    return undefined;
  }
  const listOfEtablissement = await response.json();

  if (!listOfEtablissement || listOfEtablissement.length === 0) {
    return undefined;
  }

  const siege = listOfEtablissement[0];

  if (!siege.is_siege) {
    throw new Error(`First Etablissement is not siege : ${siren}`);
  }

  const {
    statut_diffusion = null,
    date_creation,
    nature_juridique_entreprise = null,
    tranche_effectif_salarie_entreprise = null,
    nombre_etablissements,
    nom_complet = 'hello',
  } = siege;

  const unite_legale = {
    siren,
    etablissement_siege: siege,
    categorie_juridique: nature_juridique_entreprise,
    tranche_effectifs: tranche_effectif_salarie_entreprise,
    date_creation,
    etablissements: listOfEtablissement,
    statut_diffusion,
    nombre_etablissements,
    nom_complet,
    page_path: generatePagePath(nom_complet, siren),
  } as UniteLegale;

  return unite_legale;
};

const getEtablissement = async (
  siret: string
): Promise<Etablissement | undefined> => {
  if (!isSirenOrSiret(siret)) {
    throw new Error(`Ceci n'est pas un numéro SIRET valide : ${siret}`);
  }
  const response = await fetch(`${routes.etablissement}${encodeURI(siret)}`);
  if (response.status === 404) {
    return undefined;
  }
  const { etablissement } = await response.json();
  return etablissement as Etablissement;
};

const getResults = async (
  searchTerms: string,
  page: string
): Promise<SearchResults | undefined> => {
  const response = await fetch(getSearchUniteLegaleRoute(searchTerms, page));

  if (response.status === 404) {
    return undefined;
  }

  const results = (await response.json()) || [];
  const { total_results = 0, total_pages = 0, unite_legale } = results[0];

  return ({
    page,
    total_results,
    total_pages,
    unite_legale: (unite_legale || []).map((result: any) => {
      return {
        ...result,
        nombre_etablissements: result.nombre_etablissements || 1,
        page_path: generatePagePath(result.nom_complet, result.siren),
        libelle_activite_principale: libelleFromCodeNaf(
          result.activite_principale
        ),
      } as ResultUniteLegale;
    }),
  } as unknown) as SearchResults;
};

export { getEtablissement, getUniteLegale, getResults };
