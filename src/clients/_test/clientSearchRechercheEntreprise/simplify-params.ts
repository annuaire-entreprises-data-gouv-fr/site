interface IParams {
  pageResultatsRecherche?: number;
  searchFilterParams?: {
    toApiURI: () => string;
  };
  searchTerms: string;
}

export default function simplifyParams(a: IParams) {
  return {
    pageResultatsRecherche: a.pageResultatsRecherche,
    searchTerms: a.searchTerms,
    searchFilterParams: a.searchFilterParams?.toApiURI() ?? "",
  };
}
