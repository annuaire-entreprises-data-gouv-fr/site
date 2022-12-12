import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import Breadcrumb from '#components-ui/breadcrumb';
import ButtonLink from '#components-ui/button';
import TextWrapper from '#components-ui/text-wrapper';
import constants from '#models/constants';
import { getAllFaqArticles, getFaqArticle, IArticle } from '#models/faq';
import Page from '../../layouts';

const FAQArticle: React.FC<{ article: IArticle }> = ({ article }) => (
  <Page small={true} title="Cette administration ne répond pas" noIndex={false}>
    <TextWrapper>
      <Breadcrumb
        links={[
          { href: '/faq', label: 'Questions fréquentes' },
          { href: '', label: article.title },
        ]}
      />
      <h1>{article.title}</h1>
      <ReactMarkdown>{article.body}</ReactMarkdown>
      {article.cta ? (
        <div className="layout-left">
          <ButtonLink to={article.cta.to}>{article.cta.label}</ButtonLink>
        </div>
      ) : null}
      {article.more ? (
        <div>
          <h2>Sur le même sujet</h2>
          {article.more.map(({ href, label }) => (
            <a href={href}>{label}</a>
          ))}
        </div>
      ) : null}
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
