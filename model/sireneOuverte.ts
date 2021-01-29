import { generatePagePath } from '../utils/formatting';
import { isSirenOrSiret, libelleFromCodeNaf } from '../utils/helper';
import logErrorInSentry from '../utils/sentry';
import {
  ResultUniteLegale,
  UniteLegale,
  Etablissement,
  SearchResults,
} from './index';
import routes, {
  getSearchUniteLegaleRoute,
  getUniteLegaleRoute,
} from './routes';

const getUniteLegaleSirenOuverte = async (
  siren: string
): Promise<UniteLegale | undefined> => {
  if (!isSirenOrSiret(siren)) {
    throw new Error(`Ceci n'est pas un numéro SIREN valide : ${siren}`);
  }
  const response = await fetch(getUniteLegaleRoute(siren));
  if (response.status === 404) {
    return undefined;
  }
  try {
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
        page_path: result.nom_url || result.siren,
        libelle_activite_principale: libelleFromCodeNaf(
          result.activite_principale
        ),
      } as ResultUniteLegale;
    }),
  } as unknown) as SearchResults;
};

export { getEtablissement, getUniteLegaleSirenOuverte, getResults };
