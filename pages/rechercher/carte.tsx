import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { search } from '../../models';
import PageCounter from '../../components/results-page-counter';
import { redirectIfSiretOrSiren } from '../../utils/redirect';
import {
  parseIntWithDefaultValue,
  removeInvisibleChar,
  trimWhitespace,
} from '../../utils/helpers/formatting';
import { isSirenOrSiret } from '../../utils/helpers/siren-and-siret';
import ResultsHeader from '../../components/results-header';
import { ISearchResults } from '../../models/search';
import ResultsList from '../../components/results-list';
import MapResults from '../../components/mapbox/map-results';

interface IProps extends ISearchResults {
  searchTerm: string;
  currentPage: number;
}

const About: React.FC<IProps> = ({
  results,
  pageCount,
  resultCount,
  searchTerm,
  currentPage = 1,
}) => (
  <Page
    small={true}
    currentSearchTerm={searchTerm}
    map={true}
    noIndex={true}
    title="Rechercher une entreprise"
    canonical="https://annuaire-entreprises.data.gouv.fr/rechercher/carte"
  >
    <div className="map-container">
      <MapResults results={results} />
      {results && (
        <div className="map-results">
          <div className="results">
            <div className="results-counter">
              <ResultsHeader
                resultCount={resultCount}
                searchTerm={searchTerm}
                currentPage={currentPage}
              />
            </div>
            <ResultsList results={results} />
          </div>
          <div className="results-footer">
            <PageCounter
              totalPages={pageCount}
              currentPage={currentPage}
              searchTerm={searchTerm}
            />
          </div>
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
                tracker.trackSiteSearch("${searchTerm}", "${'carte'}", ${resultCount});
              }
            }
          }
          window.setTimeout(logSearch, 500);
          `,
      }}
    />
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
