import React from 'react';

import { GetStaticProps } from 'next';
import Page from '../../layouts';

import AdministrationDescription from '../../components/administrations/administration-description';
import { getAllFaqArticles, IArticle } from '../../models/faq';
import { Tag } from '../../components-ui/tag';

const StatusPage: React.FC<{
  articles: IArticle[];
}> = ({ articles }) => (
  <Page
    small={true}
    title="FAQ de l'Annuaire des Entreprises"
    canonical={`https://annuaire-entreprises.data.gouv.fr/sources-de-donnees}`}
  >
    <div className="content-container">
      <h1>FAQ</h1>
      <p>Conseils et réponses de l’équipe Annuaire des Entreprises</p>
      {articles.map(({ slug, title }) => (
        <div>
          <a href={`/faq/${slug}`}>{title}</a>
        </div>
      ))}
    </div>
  </Page>
);

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      articles: getAllFaqArticles(),
    },
  };
};

export default StatusPage;
