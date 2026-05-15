import { createFileRoute } from "@tanstack/react-router";
import parseMarkdownSync from "#/components/markdown/parse-markdown";
import StructuredDataFAQ from "#/components/structured-data/faq";
import TextWrapper from "#/components-ui/text-wrapper";
import { allDefinitions } from "#/models/article/definitions";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/_header-default/definitions/")({
  head: () => {
    const canonical = "https://annuaire-entreprises.data.gouv.fr/definitions";
    return {
      meta: meta({
        title: "Definitions des termes utilisés sur l’Annuaire des Entreprises",
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
  const definitions = allDefinitions;

  return (
    <>
      <StructuredDataFAQ
        data={definitions.map(({ title, body }) => [
          title,
          parseMarkdownSync(body).html,
        ])}
      />
      <TextWrapper>
        <h1>Définitions</h1>
        <ul>
          {definitions.map(({ slug, title }) => (
            <li key={slug}>
              <a
                aria-label={title + ", voir la définition"}
                href={`/definitions/${slug}`}
              >
                {title}
              </a>
            </li>
          ))}
        </ul>
      </TextWrapper>
    </>
  );
}
