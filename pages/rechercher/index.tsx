import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { getResults, SearchResults } from '../../model';
import ResultList from '../../components/result-list';
import PageCounter from '../../components/page-counter';
import { pin } from '../../components/icon';
import { redirectIfSiretOrSiren } from '../../utils/redirect';
import { removeInvisibleChar } from '../../utils/formatting';
import { parsePage } from '../../model/sirene-ouverte';

interface IProps {
  response: SearchResults;
  searchTerm: string;
  currentPage: number;
}

const About: React.FC<IProps> = ({ response, searchTerm, currentPage = 1 }) => (
  <Page
    small={true}
    currentSearchTerm={searchTerm}
    title="Rechercher une entreprise"
    canonical="https://annuaire-entreprises.data.gouv.fr"
  >
    <div className="result-content-container">
      {response.total_results ? (
        <div className="results-counter">
          {currentPage > 1 && `Page ${currentPage} de `}
          {response.total_results} résultats trouvés pour “<b>{searchTerm}</b>”.
          <a href={`/rechercher/carte?terme=${searchTerm}`}>
            {pin} Afficher les résultats sur la carte
          </a>
        </div>
      ) : (
        <div className="results-counter">
          Aucune entité n’a été trouvée pour “<b>{searchTerm}</b>”
          <p>
            Nous vous suggérons de vérifier l’orthographe du nom, du SIRET, ou
            de l'adresse que vous avez utilisé.
          </p>
        </div>
      )}

      {response && response.unite_legale && (
        <div>
          <ResultList resultList={response.unite_legale} />
          {response.total_pages && response.total_pages > 1 ? (
            <PageCounter
              totalPages={response.total_pages}
              currentPage={currentPage}
              searchTerm={searchTerm}
            />
          ) : null}
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
              tracker.trackSiteSearch("${searchTerm}", "${'recherche en liste'}", ${
          response.total_results
        });
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
  //@ts-ignore
  const searchTerm = (context.query.terme || '') as string;
  const escapedTerm = removeInvisibleChar(searchTerm);

  redirectIfSiretOrSiren(context.res, escapedTerm);

  //@ts-ignore
  const page = parsePage(context.query.page || '1') - 1;

  const results = await getResults(escapedTerm, page.toString());

  return {
    props: {
      response: results || {},
      searchTerm,
      currentPage: parsePage(results ? results.page : '0') + 1,
    },
  };
};

export default About;
