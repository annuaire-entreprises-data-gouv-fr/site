import { GetStaticPaths, GetStaticProps } from 'next';
import Breadcrumb from '#components-ui/breadcrumb';
import ButtonLink from '#components-ui/button';
import TextWrapper from '#components-ui/text-wrapper';
import Meta from '#components/meta';
import {
  IFaqArticle,
  allFaqArticles,
  getFaqArticle,
} from '#models/article/faq';
import { NextPageWithLayout } from 'pages/_app';

const FAQArticle: NextPageWithLayout<{ article: IFaqArticle }> = ({
  article,
}) => (
  <>
    <Meta
      title={article.seo.title || article.title}
      description={article.seo.description}
      noIndex={false}
      canonical={`https://annuaire-entreprises.data.gouv.fr/faq/${article.slug}`}
    />
    <TextWrapper>
      <Breadcrumb
        links={[
          { href: '/faq', label: 'Questions fréquentes' },
          { href: '', label: article.title },
        ]}
      />
      <h1>{article.title}</h1>
      <div
        dangerouslySetInnerHTML={{
          __html: article.body.html,
        }}
      />
      {article.cta ? (
        <div className="layout-left">
          <ButtonLink to={article.cta.to}>{article.cta.label}</ButtonLink>
        </div>
      ) : null}
      {article.more ? (
        <div>
          <h2>Sur le même sujet</h2>
          <ul>
            {article.more.map(({ href, label }) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <h2>Vous ne trouvez pas votre réponse ?</h2>
      <div className="layout-left">
        <ButtonLink to="/faq" alt small>
          Consultez notre FAQ
        </ButtonLink>
      </div>
    </TextWrapper>
  </>
);

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: allFaqArticles.map(({ slug }) => {
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
