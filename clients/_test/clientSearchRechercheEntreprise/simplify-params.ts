type IParams = {
  pageResultatsRecherche: number;
  searchTerms: string;
  searchFilterParams?: {
    toApiURI: () => string;
  };
};

export default function simplifyParams(a: IParams) {
  return {
    pageResultatsRecherche: a.pageResultatsRecherche,
    searchTerms: a.searchTerms,
    searchFilterParams: a.searchFilterParams?.toApiURI() ?? '',
  };
}
