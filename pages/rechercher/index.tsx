import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { isSirenOrSiret } from '../../utils/helper';
import { getResults, SearchResults } from '../../model';
import { parsePage, removeInvisibleChar } from '../../model/routes';
import ResultList from '../../components/resultList';
import PageCounter from '../../components/pageCounter';
import { pin } from '../../static/icon';

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
  >
    <div className="content-container">
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
          Aucune société n’a été trouvée pour “<b>{searchTerm}</b>”
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

    <style jsx>{`
      .results-counter {
        margin-top: 10px;
        color: rgb(112, 117, 122);
      }
    `}</style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const searchTerm = context.query.terme as string;
  const escapedTerm = removeInvisibleChar(searchTerm);

  if (isSirenOrSiret(escapedTerm)) {
    context.res.writeHead(302, {
      Location: `/entreprise/${escapedTerm}`,
    });
    context.res.end();
  }

  const results = await getResults(
    escapedTerm,
    (context.query.page || '1') as string
  );

  return {
    props: {
      response: results || {},
      searchTerm,
      currentPage: parsePage(results ? results.page : '1'),
    },
  };
};

export default About;
