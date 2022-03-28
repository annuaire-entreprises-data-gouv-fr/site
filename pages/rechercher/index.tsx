import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import ResultsList from '../../components/results-list';
import PageCounter from '../../components/results-page-counter';
import {
  parseIntWithDefaultValue,
  serializeForClientScript,
} from '../../utils/helpers/formatting';
import search, { ISearchResults } from '../../models/search';
import ResultsHeader from '../../components/results-header';
import HiddenH1 from '../../components/a11y-components/hidden-h1';
import StructuredDataSearchAction from '../../components/structured-data/search';
import { IPropsWithSession, withSession } from '../../hocs/with-session';
import { withError } from '../../hocs/with-error';

interface IProps extends ISearchResults, IPropsWithSession {
  searchTerm: string;
}

const SearchResultPage: React.FC<IProps> = ({
  results,
  pageCount,
  currentPage = 1,
  resultCount,
  searchTerm,
  session,
}) => (
  <Page
    currentSearchTerm={searchTerm}
    title="Rechercher une entreprise"
    canonical="https://annuaire-entreprises.data.gouv.fr"
    session={session}
  >
    <StructuredDataSearchAction />
    <HiddenH1 title="Résultats de recherche" />
    <div className="result-content-container">
      <ResultsHeader
        resultCount={resultCount}
        searchTerm={searchTerm}
        currentPage={currentPage}
      />

      {results && (
        <div>
          <ResultsList
            results={results}
            withFeedback={true}
            searchTerm={searchTerm}
          />
          <PageCounter
            totalPages={pageCount}
            querySuffix={`terme=${searchTerm}`}
            currentPage={currentPage}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: `
                <script>
                  var links = document.getElementsByClassName("result-link");
                  for (let i = 0; i < links.length; i++) {
                    links[i].addEventListener("click", function() {
                      if (typeof window !== 'undefined' && window._paq) {
                        var position = 10*${currentPage - 1}+i+1;
                        var siren = links[i].attributes['data-siren'].value;

                        window._paq.push([
                          'trackEvent',
                          'research:click',
                          '${serializeForClientScript(searchTerm)}',
                          'selectedSiren='+siren+'-position='+position+'-resultCount='+${resultCount},
                        ]);
                      }
                    });
                  }
                </script>
              `,
            }}
          ></div>
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

export const getServerSideProps: GetServerSideProps = withError(
  withSession(async (context) => {
    // get params from query string
    const searchTermParam = (context.query.terme || '') as string;
    const pageParam = (context.query.page || '') as string;
    const page = parseIntWithDefaultValue(pageParam, 1);

    const results = (await search(searchTermParam, page)) || {};
    return {
      props: {
        ...results,
        searchTerm: searchTermParam,
      },
    };
  })
);

export default SearchResultPage;
