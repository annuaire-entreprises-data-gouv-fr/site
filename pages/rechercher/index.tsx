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

interface IProps extends ISearchResults {
  searchTerm: string;
}

const SearchResultPage: React.FC<IProps> = ({
  results,
  pageCount,
  currentPage = 1,
  resultCount,
  searchTerm,
}) => (
  <Page
    small={true}
    currentSearchTerm={searchTerm}
    title="Rechercher une entreprise"
    canonical="https://annuaire-entreprises.data.gouv.fr"
  >
    <HiddenH1 title="Résultats de recherche" />
    <div className="result-content-container">
      <ResultsHeader
        resultCount={resultCount}
        searchTerm={searchTerm}
        currentPage={currentPage}
      />

      {results && (
        <div>
          <ResultsList results={results} />
          <PageCounter
            totalPages={pageCount}
            querySuffix={`terme=${searchTerm}`}
            currentPage={currentPage}
          />
        </div>
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
  const searchTermParam = (context.query.terme || '') as string;
  const pageParam = (context.query.page || '') as string;
  const page = parseIntWithDefaultValue(pageParam, 1);

  try {
    const results = (await search(searchTermParam, page)) || {};
    return {
      props: {
        ...results,
        searchTerm: searchTermParam,
      },
    };
  } catch (e: any) {
    if (e instanceof IsLikelyASirenOrSiretException) {
      redirectIfSiretOrSiren(context.res, e.message);
    } else {
      redirectServerError(context.res, e.message);
    }
    return { props: {} };
  }
};

export default SearchResultPage;
