import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import ResultsList from '../../components/results-list';
import PageCounter from '../../components/results-page-counter';
import { redirectServerError } from '../../utils/redirects';
import {
  parseIntWithDefaultValue,
  serializeForClientScript,
} from '../../utils/helpers/formatting';
import search, { ISearchParams, ISearchResults } from '../../models/search';
import ResultsHeader from '../../components/results-header';
import { IsLikelyASirenOrSiretException } from '../../models';
import { redirectIfSiretOrSiren } from '../../utils/redirects/routers';
import HiddenH1 from '../../components/a11y-components/hidden-h1';
import StructuredDataSearchAction from '../../components/structured-data/search';
import { isAPINotResponding } from '../../models/api-not-responding';
import { SearchErrorExplanations } from '../../components/error-explanations';

interface IProps {
  searchTerm: string;
  results: ISearchResults;
  searchParams: ISearchParams;
}

const SearchResultPage: React.FC<IProps> = ({
  results,
  searchTerm,
  searchParams,
}) => (
  <Page
    small={true}
    currentSearchTerm={searchTerm}
    searchParams={searchParams}
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
              />
              <div
                dangerouslySetInnerHTML={{
                  __html: `
                <script>
                  var links = document.getElementsByClassName("result-link");
                  for (let i = 0; i < links.length; i++) {
                    links[i].addEventListener("click", function() {
                      if (typeof window !== 'undefined' && window._paq) {
                        var position = 10*${results.currentPage - 1}+i+1;
                        var siren = links[i].attributes['data-siren'].value;

                        window._paq.push([
                          'trackEvent',
                          'research:click',
                          '${serializeForClientScript(searchTerm)}',
                          'selectedSiren='+siren+'-position='+position+'-resultCount='+${
                            results.resultCount
                          },
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
  const searchTermParam = (context.query.terme || '') as string;
  const pageParam = (context.query.page || '') as string;
  const page = parseIntWithDefaultValue(pageParam, 1);

  const searchParams = {
    section_activite_principale: (context.query.section_activite_principale ||
      '') as string,
    code_postal: (context.query.code_postal || '') as string,
  };

  const hasParams = Object.values(searchParams).some((v) => v !== '');

  try {
    const results = (await search(searchTermParam, page, searchParams)) || {};
    return {
      props: {
        results,
        searchTerm: searchTermParam,
        searchParams: hasParams ? searchParams : null,
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
