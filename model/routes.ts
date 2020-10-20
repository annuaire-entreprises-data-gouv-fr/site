const routes = {
  etablissement: `https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/`,
  uniteLegale: `https://entreprise.data.gouv.fr/api/sirene/v3/unites_legales/`,
  recherche: `https://entreprise.data.gouv.fr/api/sirene/v1/full_text/`,
  rechercheUniteLeegale: `http://recherche.entreprise.dataeng.etalab.studio/?search=`,
};

export const escapeSearchTerm = (searchTerm: string) => {
  return searchTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const parsePage = (pageAsString: string) => {
  try {
    return parseInt(pageAsString, 10);
  } catch {
    return 1;
  }
};

export const getResultPage = (searchterm: string, page: string) => {
  return `${routes.recherche}${encodeURI(
    escapeSearchTerm(searchterm)
  )}?per_page=10&page=${parsePage(page) || 1}`;
};

export const getResultUniteLegalePage = (searchterm: string, page: string) => {
  console.log(page);
  return `${routes.rechercheUniteLeegale}${encodeURI(
    escapeSearchTerm(searchterm)
  )}`;
};

export default routes;
