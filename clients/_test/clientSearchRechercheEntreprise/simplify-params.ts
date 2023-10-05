type IParams = {
  page: number;
  searchTerms: string;
  searchFilterParams?: {
    toApiURI: () => string;
  };
};

export default function simplifyParams(a: IParams) {
  return {
    page: a.page,
    searchTerms: a.searchTerms,
    searchFilterParams: a.searchFilterParams?.toApiURI() ?? '',
  };
}
