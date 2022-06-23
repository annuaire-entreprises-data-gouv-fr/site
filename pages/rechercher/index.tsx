import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import ResultsList from '../../components/results-list';
import PageCounter from '../../components/results-page-counter';
import { redirectServerError } from '../../utils/redirects';
import { parseIntWithDefaultValue } from '../../utils/helpers/formatting';
import search, { ISearchResults } from '../../models/search';
import ResultsHeader from '../../components/results-header';
import { IsLikelyASirenOrSiretException } from '../../models';
import { redirectIfSiretOrSiren } from '../../utils/redirects/routers';
import HiddenH1 from '../../components/a11y-components/hidden-h1';
import StructuredDataSearchAction from '../../components/structured-data/search';
import { isAPINotResponding } from '../../models/api-not-responding';
import { SearchErrorExplanations } from '../../components/error-explanations';
import SearchFilterParams, { IParams } from '../../models/search-filter-params';
import MatomoEventSearchClick from '../../components/matomo-event/search-click';

interface IProps {
  searchTerm: string;
  results: ISearchResults;
  searchFilterParams: IParams;
}

const SearchResultPage: React.FC<IProps> = ({
  results,
  searchTerm,
  searchFilterParams,
}) => (
  <Page
    small={true}
    currentSearchTerm={searchTerm}
    searchFilterParams={searchFilterParams}
    title="Rechercher une entreprise"
    canonical="https://annuaire-entreprises.data.gouv.fr"
  >
    <StructuredDataSearchAction />
    <HiddenH1 title="Résultats de recherche" />
    <div className="result-content-container">
      {isAPINotResponding(results) ? (
        <SearchErrorExplanations />
      ) : (
        <>
          <ResultsHeader
            resultCount={results.resultCount}
            searchTerm={searchTerm}
            currentPage={results.currentPage}
          />
          {results && (
            <div>
              <ResultsList
                results={results.results}
                withFeedback={true}
                searchTerm={searchTerm}
              />
              <PageCounter
                totalPages={results.pageCount}
                querySuffix={`terme=${searchTerm}`}
                currentPage={results.currentPage}
                searchFilterParams={searchFilterParams}
              />
              <MatomoEventSearchClick
                position={results.currentPage - 1}
                resultCount={results.resultCount}
                searchTerm={searchTerm}
                isAdvancedSearch={SearchFilterParams.hasParam(
                  searchFilterParams
                )}
              />
            </div>
          )}
        </>
      )}
    </div>

    <style jsx>{`
      .results-counter {
        margin-top: 20px;
        color: rgb(112, 117, 122);
      }
    `}</style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  // get params from query string
  const searchTerm = (context.query.terme || '') as string;
  const pageParam = (context.query.page || '') as string;
  const page = parseIntWithDefaultValue(pageParam, 1);
  const searchFilterParams = new SearchFilterParams(context.query);

  try {
    const results = (await search(searchTerm, page, searchFilterParams)) || {};
    return {
      props: {
        results,
        searchTerm,
        searchFilterParams: searchFilterParams.toJSON(),
      },
    };
  } catch (e: any) {
    if (e instanceof IsLikelyASirenOrSiretException) {
      return redirectIfSiretOrSiren(e.message);
    } else {
      return redirectServerError(e.message);
    }
  }
};

export default SearchResultPage;
