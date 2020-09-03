import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';

const About: React.FC = ({ response, slug, currentPage = 1, maxPage }) => (
  <Page small={true}>
    <div className="content-container">
      <div className="results-counter">
        {response.total_results} entreprises trouvées pour “<b>{slug}</b>”
      </div>
      <div className="results-list">
        {response.etablissement.map((etablissement) => (
          <a
            href={`/personne-morale/${etablissement.siret}`}
            className="dont-apply-link-style"
          >
            <div className="title">
              {etablissement.l1_normalisee.toLowerCase()}
            </div>
            <div>{etablissement.libelle_activite_principale}</div>
            <div className="adress">{etablissement.geo_adresse}</div>
          </a>
        ))}
        {response.total_pages > 1 && (
          <div className="pages-selector">
            {currentPage !== 1 && <a>⇠ précédente</a>}
            <div>
              {[...Array(response.total_pages).keys()].map((pageNum) => {
                if (response.total_pages > 10) {
                  if (pageNum === 3) return <div>...</div>;
                  if (pageNum > 3 && pageNum < response.total_pages - 3) {
                    return;
                  }
                }
                return (
                  <a
                    className={`${currentPage === pageNum + 1 ? 'active' : ''}`}
                  >
                    {pageNum + 1}
                  </a>
                );
              })}
            </div>
            {currentPage !== response.total_pages && <a>suivante ⇢</a>}
          </div>
        )}
      </div>
    </div>

    <style jsx>{`
      .results-counter {
        margin-top: 10px;
        color: rgb(112, 117, 122);
      }

      .results-list > a {
        text-decoration: none;
        color: #333;
        margin: 25px 0;
        display: block;
      }
      .title {
        color: #000091;
        text-decoration: none;
        font-size: 1.4rem;
        margin-bottom: 5px;
      }
      .title:hover {
        text-decoration: underline;
      }

      .adress {
        font-size: 0.9rem;
        color: rgb(112, 117, 122);
      }

      .pages-selector {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px 0;
      }
      .pages-selector > div {
        display: flex;
        margin: 0 30px;
      }
      .pages-selector > div > a {
        border-radius: 3px;
        padding: 0 5px;
        margin: 0 3px;
      }
      .pages-selector > div > a.active {
        border: 1px solid #000091;
      }
    `}</style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const slug = context.params.slug;

  const request = await fetch(
    `https://entreprise.data.gouv.fr/api/sirene/v1/full_text/${encodeURI(
      slug
    )}?per_page=10&page=1`
  );

  const response = await request.json();
  return {
    props: {
      response,
      slug,
    },
  };
};

export default About;
