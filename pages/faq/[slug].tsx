import React from 'react';
import ReactMarkdown from 'react-markdown';
import { GetStaticPaths, GetStaticProps } from 'next';

import Page from '../../layouts';
import { getAllFaqArticles, getFaqArticle, IArticle } from '../../models/faq';
import ButtonLink from '../../components-ui/button';

const FAQArticle: React.FC<{ article: IArticle }> = ({ article }) => (
  <Page small={true} title="Cette administration ne répond pas" noIndex={true}>
    <div className="content-container">
      <br />
      <a href="/faq">← Toutes les questions fréquentes</a>
      <h1>{article.title}</h1>
      <ReactMarkdown>{article.body}</ReactMarkdown>
      {article.cta ? (
        <div className="layout-center">
          <ButtonLink to={article.cta.to}>{article.cta.label}</ButtonLink>
        </div>
      ) : null}
    </div>
  </Page>
);

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getAllFaqArticles().map(({ slug }) => {
      return {
        params: {
          slug,
        },
      };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const article = getFaqArticle(slug);
  return {
    props: {
      article,
    },
  };
};

export default FAQArticle;
