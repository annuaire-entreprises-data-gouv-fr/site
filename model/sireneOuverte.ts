import { escapeTerm } from '../utils/formatting';
import { isSirenOrSiret, libelleFromCodeNaf } from '../utils/helper';
import logErrorInSentry from '../utils/sentry';
import {
  ResultUniteLegale,
  UniteLegale,
  Etablissement,
  SearchResults,
} from './index';
import routes from './routes';

/**
 * API SIRENE by Etalab
 *
 * This API provide :
 * - a Results route for search pages
 * - an UniteLegale for entreprise pages
 * - an Etablissement for etablissement pages
 *
 */

/**
 * SEARCH UNITE LEGALE
 */

export const parsePage = (pageAsString: string) => {
  try {
    return parseInt(pageAsString, 10);
  } catch {
    return 1;
  }
};

const getResults = async (
  searchTerms: string,
  page: string
): Promise<SearchResults | undefined> => {
  const resultPage = parsePage(page) || 1;
  const encodedTerms = encodeURI(escapeTerm(searchTerms));
  const route = `${routes.sireneOuverte.rechercheUniteLegale}?per_page=10&page=${resultPage}&q=${encodedTerms}`;

  const response = await fetch(route);

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
        page_path: result.nom_url || result.siren,
        libelle_activite_principale: libelleFromCodeNaf(
          result.activite_principale
        ),
      } as ResultUniteLegale;
    }),
  } as unknown) as SearchResults;
};

/**
 * GET UNITE LEGALE
 */

const getUniteLegaleSirenOuverte = async (
  siren: string
): Promise<UniteLegale | undefined> => {
  if (!isSirenOrSiret(siren)) {
    throw new Error(`Ceci n'est pas un numéro SIREN valide : ${siren}`);
  }
  try {
    const response = await fetch(routes.sireneOuverte.uniteLegale + siren);
    if (response.status === 404) {
      return undefined;
    }
    const result = (await response.json())[0].unite_legale;
    if (!result) {
      return undefined;
    }

    const uniteLegale = result[0];

    if (!uniteLegale) {
      return undefined;
    }

    const siege = uniteLegale.etablissement_siege[0];

    if (!siege.is_siege) {
      throw new Error(`Etablissement siege is not siege : ${siren}`);
    }

    const listOfEtablissement = uniteLegale.etablissements;

    if (!listOfEtablissement || listOfEtablissement.length === 0) {
      throw new Error(`No etablissements found`);
    }

    const {
      date_creation,
      date_creation_entreprise,
      date_mise_a_jour,
      numero_tva_intra,
      date_debut_activite,
      tranche_effectif_salarie_entreprise,
    } = uniteLegale;

    const {
      statut_diffusion = null,
      nature_juridique_entreprise = null,
      nombre_etablissements,
      nom_complet = null,
      nom_url = null,
    } = siege;

    const unite_legale = {
      siren,
      numero_tva_intra,
      etablissement_siege: siege,
      categorie_juridique: nature_juridique_entreprise,
      tranche_effectif_salarie_entreprise,
      etablissements: listOfEtablissement,
      statut_diffusion,
      nombre_etablissements,
      nom_complet,
      page_path: nom_url || siren,
      date_creation,
      date_creation_entreprise,
      date_debut_activite,
      date_mise_a_jour,
    } as UniteLegale;

    return unite_legale;
  } catch (e) {
    console.log(e);
    logErrorInSentry(e);
    return undefined;
  }
};

/**
 * GET ETABLISSEMENT
 */

const getEtablissement = async (
  siret: string
): Promise<Etablissement | undefined> => {
  if (!isSirenOrSiret(siret)) {
    throw new Error(`Ceci n'est pas un numéro SIRET valide : ${siret}`);
  }

  try {
    const response = await fetch(
      `${routes.sireneOuverte.etablissement}${encodeURI(siret)}`
    );
    if (response.status === 404) {
      return undefined;
    }
    const result = (await response.json())[0].etablissement;

    if (!result) {
      return undefined;
    }

    const etablissement = result[0];

    if (!etablissement) {
      return undefined;
    }

    return etablissement as Etablissement;
  } catch (e) {
    console.log(e);
    logErrorInSentry(e);
    return undefined;
  }
};

export { getEtablissement, getUniteLegaleSirenOuverte, getResults };
