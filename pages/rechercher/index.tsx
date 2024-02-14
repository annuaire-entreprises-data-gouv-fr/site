import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import HiddenH1 from '#components/a11y-components/hidden-h1';
import { LayoutSearch } from '#components/layouts/layout-search';
import Meta from '#components/meta';
import SearchResults from '#components/search-results';
import { AdvancedSearchTutorial } from '#components/search-results/advanced-search-tutorial';
import StructuredDataSearchAction from '#components/structured-data/search';
import { ISearchResults, searchWithoutProtectedSiren } from '#models/search';
import SearchFilterParams, {
  IParams,
  hasSearchParam,
} from '#models/search-filter-params';
import { parseIntWithDefaultValue } from '#utils/helpers';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  searchTerm: string;
  results: ISearchResults;
  searchFilterParams: IParams;
}

const SearchResultPage: NextPageWithLayout<IProps> = ({
  results,
  searchFilterParams,
  searchTerm,
}) => {
  return (
    <>
      <Meta
        title="Rechercher une entreprise"
        canonical="https://annuaire-entreprises.data.gouv.fr/rechercher"
      />
      <StructuredDataSearchAction />
      <HiddenH1 title="Résultats de recherche" />
      <div className="content-container">
        {!hasSearchParam(searchFilterParams) && !searchTerm ? (
          <AdvancedSearchTutorial />
        ) : (
          <SearchResults
            results={results}
            searchTerm={searchTerm}
            searchFilterParams={searchFilterParams}
          />
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    // get params from query string
    const searchTerm = (context.query.terme || '') as string;
    const pageParam = (context.query.page || '') as string;

    const page = parseIntWithDefaultValue(pageParam, 1);
    const searchFilterParams = new SearchFilterParams(context.query);

    const results = await searchWithoutProtectedSiren(
      searchTerm,
      page,
      searchFilterParams
    );

    return {
      props: {
        results,
        searchTerm,
        searchFilterParams: searchFilterParams.toJSON(),
      },
    };
  }
);

SearchResultPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutSearch>{page}</LayoutSearch>;
};

export default SearchResultPage;
