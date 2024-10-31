import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumb from '#components-ui/breadcrumb';
import ButtonLink from '#components-ui/button';
import TextWrapper from '#components-ui/text-wrapper';
import { RenderMarkdownServerOnly } from '#components/markdown';
import { allFaqArticles, getFaqArticle } from '#models/article/faq';
import { Exception } from '#models/exceptions';
import { logWarningInSentry } from '#utils/sentry';
import { AppRouterProps } from '#utils/server-side-helper/app/extract-params';

type IParams = {
  slug: string;
};

// should not happen since we declared generateStaticParams
const redirectFAQPageNotFound = (slug: string) => {
  logWarningInSentry(
    new Exception({
      name: 'FAQPageNotFound',
      context: { slug },
    })
  );
  notFound();
};

export default async function FAQArticle(props: AppRouterProps) {
  const article = getFaqArticle(props.params.slug);
  if (!article) {
    return redirectFAQPageNotFound(props.params.slug);
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

export const generateMetadata = function (props: AppRouterProps): Metadata {
  const article = getFaqArticle(props.params.slug);
  if (!article) {
    return redirectFAQPageNotFound(props.params.slug);
  }
  return {
    title: article.seo.title || article.title,
    description: article.seo.description,
    robots: 'index, follow',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/faq/${article.slug}`,
    },
  };
};
