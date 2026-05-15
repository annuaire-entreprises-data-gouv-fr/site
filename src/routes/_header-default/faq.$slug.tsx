import { createFileRoute, notFound } from "@tanstack/react-router";
import { RenderMarkdown } from "#/components/markdown";
import Breadcrumb from "#/components-ui/breadcrumb";
import ButtonLink from "#/components-ui/button";
import TextWrapper from "#/components-ui/text-wrapper";
import { getFaqArticle } from "#/models/article/faq";
import { Exception } from "#/models/exceptions";
import { logWarningInSentry } from "#/utils/sentry";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/_header-default/faq/$slug")({
  loader: async ({ params }) => {
    const article = getFaqArticle(params.slug);
    if (!article) {
      logWarningInSentry(
        new Exception({
          name: "FAQPageNotFound",
          context: { slug: params.slug },
        })
      );
      throw notFound();
    }
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return meta.notFound();
    }
    const { article } = loaderData;
    const canonical = `https://annuaire-entreprises.data.gouv.fr/faq/${article.slug}`;
    return {
      meta: meta({
        title: article.seo.title || article.title,
        description: article.seo.description,
        robots: "index, follow",
        alternates: {
          canonical,
        },
      }),
      links: [
        {
          rel: "canonical",
          href: canonical,
        },
      ],
    };
  },
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
});

function RouteComponent() {
  const { article } = Route.useLoaderData();

  return (
    <TextWrapper>
      <Breadcrumb
        links={[
          { to: "/faq", label: "Questions fréquentes" },
          { to: ".", label: article.title },
        ]}
      />
      <h1>{article.title}</h1>
      <RenderMarkdown>{article.body}</RenderMarkdown>
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
        <ButtonLink alt small to="/faq">
          Consultez notre FAQ
        </ButtonLink>
      </div>
    </TextWrapper>
  );
}
