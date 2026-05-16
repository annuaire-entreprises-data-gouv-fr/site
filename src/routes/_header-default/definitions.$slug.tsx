import { createFileRoute, notFound } from "@tanstack/react-router";
import { RenderMarkdown } from "#/components/markdown";
import { NotFound } from "#/components/screens/not-found";
import Breadcrumb from "#/components-ui/breadcrumb";
import ButtonLink from "#/components-ui/button";
import TextWrapper from "#/components-ui/text-wrapper";
import { getDefinition } from "#/models/article/definitions";
import { Exception } from "#/models/exceptions";
import { logWarningInSentry } from "#/utils/sentry";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/_header-default/definitions/$slug")({
  loader: async ({ params }) => {
    const definition = getDefinition(params.slug);
    if (!definition?.body || !definition.title) {
      // should not happen as we prebuild
      logWarningInSentry(
        new Exception({
          name: "DefinitionPageNotFound",
          context: { slug: params.slug },
        })
      );
      throw notFound();
    }

    return { definition };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return meta.notFound();
    }

    const { definition } = loaderData;
    const canonical = `https://annuaire-entreprises.data.gouv.fr/definitions/${definition.slug}`;
    return {
      meta: meta({
        title: definition.seo.title || definition.title,
        description: definition.seo.description,
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
  notFoundComponent: () => <NotFound withWrapper={false} />,
});

function RouteComponent() {
  const { definition } = Route.useLoaderData();

  return (
    <TextWrapper>
      <Breadcrumb
        links={[
          { to: "/definitions", label: "Définitions" },
          { to: ".", label: definition.title },
        ]}
      />
      <h1 className="definition-title">{definition.title}</h1>
      <RenderMarkdown showToc>{definition.body}</RenderMarkdown>

      {definition.cta ? (
        <div className="layout-left">
          <ButtonLink to={definition.cta.to}>{definition.cta.label}</ButtonLink>
        </div>
      ) : null}
      {definition.more ? (
        <div>
          <h2>Sur le même sujet</h2>
          <ul>
            {definition.more.map(({ href, label }) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </TextWrapper>
  );
}
