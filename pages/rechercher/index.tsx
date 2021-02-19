import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import ResultsList from '../../components/results-list';
import PageCounter from '../../components/results-page-counter';
import { redirectIfSiretOrSiren } from '../../utils/redirect';
import {
  parseIntWithDefaultValue,
  removeInvisibleChar,
  trimWhitespace,
} from '../../utils/helpers/formatting';
import search, { ISearchResults } from '../../models/search';
import { isSirenOrSiret } from '../../utils/helpers/siren-and-siret';
import ResultsHeader from '../../components/results-header';

interface IProps extends ISearchResults {
  searchTerm: string;
}

const About: React.FC<IProps> = ({
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
            currentPage={currentPage}
            searchTerm={searchTerm}
          />
        </div>
      )}
    </div>

    <script
      async
      defer
      dangerouslySetInnerHTML={{
        __html: `
        function logSearch () {
          if(window.Piwik) {
            var tracker = window.Piwik.getTracker();
            if (tracker) {
              tracker.trackSiteSearch("${searchTerm}", "${'recherche en liste'}", ${resultCount});
            }
          }
        }
        window.setTimeout(logSearch, 500);
          `,
      }}
    />

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

  // Removes invisible characters one might copy paste without knowing
  const cleantTerm = removeInvisibleChar(searchTermParam);

  // Redirects when user copy/pasted a siret or a siren
  const cleantTermWithNoSpace = trimWhitespace(cleantTerm);
  const shouldRedirect = isSirenOrSiret(cleantTermWithNoSpace);
  if (shouldRedirect) {
    redirectIfSiretOrSiren(context.res, cleantTermWithNoSpace);
  }

  // careful, page is not zero indexed should substract 1
  const page = parseIntWithDefaultValue(pageParam, 1) - 1;
  const results = (await search(cleantTerm, page)) || {};

  return {
    props: {
      ...results,
      searchTerm: searchTermParam,
      //currentPage: parsePage(results ? results.page : '0') + 1,
    },
  };
};

export default About;
