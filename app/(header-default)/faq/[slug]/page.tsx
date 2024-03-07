import { Metadata } from 'next';
import Breadcrumb from '#components-ui/breadcrumb';
import ButtonLink from '#components-ui/button';
import TextWrapper from '#components-ui/text-wrapper';
import { RenderMarkdownServerOnly } from '#components/markdown';
import { allFaqArticles, getFaqArticle } from '#models/article/faq';
import { InternalError } from '#models/exceptions';
import withErrorHandler from '#utils/server-side-helper/app/with-error-handler';

type IParams = {
  slug: string;
};

export default async function FAQArticle({ params }: { params: IParams }) {
  const slug = params.slug;
  const article = getFaqArticle(slug);
  if (!article) {
    throw new InternalError({
      message: 'Article not found',
      context: params,
    });
  }

  return (
    <>
      <TextWrapper>
        <Breadcrumb
          links={[
            { href: '/faq', label: 'Questions fréquentes' },
            { href: '', label: article.title },
          ]}
        />
        <h1>{article.title}</h1>
        <RenderMarkdownServerOnly>{article.body}</RenderMarkdownServerOnly>
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
}

export async function generateStaticParams(): Promise<Array<IParams>> {
  return allFaqArticles
    .filter(({ body }) => !!body)
    .map(({ slug }) => {
      return {
        slug,
      };
    });
}

export const generateMetadata = withErrorHandler(function ({
  params,
}: {
  params: IParams;
}): Metadata {
  const article = getFaqArticle(params.slug);
  if (!article) {
    throw new InternalError({
      message: 'Article not found',
      context: params,
    });
  }
  return {
    title: article.seo.title || article.title,
    description: article.seo.description,
    // TODO
    robots: {
      index: false,
    },
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/faq/${article.slug}`,
    },
  };
});
