import React from 'react';

import { GetStaticProps } from 'next';
import Page from '../../layouts';

import { getAllFaqArticles, IArticle } from '../../models/faq';
import TextWrapper from '../../components-ui/text-wrapper';
import StructuredDataFAQ from '../../components/structured-data/faq';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import ButtonLink from '../../components-ui/button';
import constants from '../../models/constants';

const StatusPage: React.FC<{
  articles: IArticle[];
}> = ({ articles }) => (
  <Page
    small={true}
    title="FAQ de l'Annuaire des Entreprises"
    canonical={`https://annuaire-entreprises.data.gouv.fr/sources-de-donnees}`}
  >
    <StructuredDataFAQ
      data={articles.map(({ title, body }) => [
        title,
        renderToStaticMarkup(<ReactMarkdown>{body}</ReactMarkdown>),
      ])}
    />
    <TextWrapper>
      <h1>Questions Fréquentes (FAQ)</h1>
      <p>Conseils et réponses de l’équipe Annuaire des Entreprises</p>
      <ul>
        {articles.map(({ slug, title }) => (
          <li>
            <a href={`/faq/${slug}`}>{title}</a>
          </li>
        ))}
      </ul>
      <h2>Vous ne trouvez pas votre réponse ?</h2>
      <p>
        Vous pouvez nous écrire directement et poser vos questions à l’adresse
        suivante&nbsp;:
      </p>
      <div className="layout-left">
        <ButtonLink to={constants.links.mailto} alt small>
          Écrivez-nous à {constants.links.mail}
        </ButtonLink>
      </div>
    </TextWrapper>
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
