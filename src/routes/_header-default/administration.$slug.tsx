import { createFileRoute, notFound } from "@tanstack/react-router";
import AdministrationDescription from "#/components/administrations/administration-description";
import { Link } from "#/components/Link";
import TextWrapper from "#/components-ui/text-wrapper";
import { administrationsMetaData } from "#/models/administrations";
import { getFaqArticlesByTag } from "#/models/article/faq";
import { meta } from "#/seo";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/_header-default/administration/$slug")({
  loader: async ({ params }) => {
    const slugs = params.slug.split("_");

    const administrations = Object.values(administrationsMetaData).filter(
      (admin) => slugs.indexOf(admin.slug) > -1
    );

    if (administrations.length === 0) {
      throw notFound();
    }

    return {
      title: administrations.map((a) => a.long).join(" et "),
      administrations,
      articles: getFaqArticlesByTag([...slugs, "all"]),
      path: params.slug,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return meta.notFound();
    }

    const { title, path } = loaderData;
    const canonical = `https://annuaire-entreprises.data.gouv.fr/administration/${path}`;
    return {
      meta: meta({
        title,
        alternates: {
          canonical,
        },
        robots: "noindex",
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
  const { administrations, articles } = Route.useLoaderData();

  return (
    <TextWrapper>
      <h1>D’où viennent les informations de cette section ?</h1>
      {administrations.map(({ slug }) => (
        <AdministrationDescription key={slug} slug={slug} />
      ))}
      {articles && (
        <>
          <h2>Vous avez une questions sur ces données ?</h2>
          <ul>
            {articles.map(({ slug, title }) => (
              <li key={slug}>
                <Link params={{ slug }} to="/faq/$slug">
                  {title}
                </Link>
              </li>
            ))}
          </ul>
          <br />
          <div>
            Vous ne trouvez pas la réponse à votre question ?{" "}
            <Link to="/faq">→ voir toutes les questions fréquentes</Link>
          </div>
        </>
      )}
    </TextWrapper>
  );
}
