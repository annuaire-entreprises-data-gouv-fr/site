import { GetStaticProps } from 'next';
import TextWrapper from '#components-ui/text-wrapper';
import Meta from '#components/meta';
import StructuredDataFAQ from '#components/structured-data/faq';
import { allFaqArticles, IFaqArticle } from '#models/article/faq';
import { NextPageWithLayout } from 'pages/_app';

const FAQPage: NextPageWithLayout<{
  articles: IFaqArticle[];
}> = ({ articles }) => (
  <>
    <Meta
      title="FAQ de l'Annuaire des Entreprises"
      canonical="https://annuaire-entreprises.data.gouv.fr/faq"
    />
    <StructuredDataFAQ
      data={articles.map(({ title, body }) => [title, body.html])}
    />
    <TextWrapper>
      <h1>Réponses à vos questions (FAQ) :</h1>
      <ul>
        {articles.map(({ slug, title }) => (
          <li key={slug}>
            <a href={`/faq/${slug}`}>{title}</a>
          </li>
        ))}
      </ul>
    </TextWrapper>
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      articles: allFaqArticles,
    },
  };
};

export default FAQPage;
