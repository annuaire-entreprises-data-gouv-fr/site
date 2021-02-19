interface UniteLegaleResultat {
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
  unite_legale: UniteLegaleResultat[];
}

/**
 * SEARCH UNITE LEGALE
 */

const getResults = async (
  searchTerms: string,
  page: number
): Promise<SearchResults | undefined> => {
  const encodedTerms = encodeURI(escapeTerm(searchTerms));
  const route = `${routes.sireneOuverte.rechercheUniteLegale}?per_page=10&page=${page}&q=${encodedTerms}`;

  const response = await fetch(route);

  if (response.status === 404) {
    return undefined;
  }

  const results = (await response.json()) || [];
  const { total_results = 0, total_pages = 0, unite_legale } = results[0];

  if (searchResults.currentPage) {
    searchResults.currentPage = parseIntWithDefaultValue(
      searchResults.currentPage
    );
  }

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

export default getResults;
