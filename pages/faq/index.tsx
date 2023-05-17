import { GetStaticProps } from 'next';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import { MultiChoice } from '#components-ui/multi-choice';
import TextWrapper from '#components-ui/text-wrapper';
import Meta from '#components/meta';
import StructuredDataFAQ from '#components/structured-data/faq';
import constants from '#models/constants';
import {
  faqTargets,
  getAllFaqArticles,
  getAllFaqArticlesByTarget,
  IArticle,
} from '#models/faq';
import { NextPageWithLayout } from 'pages/_app';

const StatusPage: NextPageWithLayout<{
  articlesByTarget: { [key: string]: IArticle[] };
  articles: IArticle[];
}> = ({ articlesByTarget, articles }) => (
  <>
    <Meta
      title="FAQ de l'Annuaire des Entreprises"
      canonical="https://annuaire-entreprises.data.gouv.fr/faq"
    />
    <StructuredDataFAQ
      data={articles.map(({ title, body }) => [
        title,
        renderToStaticMarkup(<ReactMarkdown>{body}</ReactMarkdown>),
      ])}
    />
    <TextWrapper>
      <h1>Une question ? Comment pouvons-nous vous aider ?</h1>
      <h2>
        Dites-nous qui vous-êtes pour nous aider à vous répondre plus
        précisément :
      </h2>
      <MultiChoice
        values={Object.keys(faqTargets).map((key) => {
          //@ts-ignore
          return { value: `#${key}`, label: faqTargets[key] };
        })}
        links
      />
      <h2>Toutes les questions fréquentes (FAQ) :</h2>
      {Object.keys(articlesByTarget)
        .sort()
        .map((groupKey) => (
          <React.Fragment key={groupKey}>
            <h3 id={groupKey}>
              {
                //@ts-ignore
                faqTargets[groupKey]
              }
            </h3>
            <ul>
              {articlesByTarget[groupKey].map(({ slug, title }) => (
                <li key={slug}>
                  <a href={`/faq/${slug}`}>{title}</a>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      <h2>Vous ne trouvez pas votre réponse ?</h2>
      <p>
        <a href={constants.links.mailto}>Écrivez-nous directement</a> et
        posez-nous votre question.
      </p>
    </TextWrapper>
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      articlesByTarget: getAllFaqArticlesByTarget(),
      articles: getAllFaqArticles(),
    },
  };
};

export default StatusPage;
