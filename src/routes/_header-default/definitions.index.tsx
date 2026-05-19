import { createFileRoute } from "@tanstack/react-router";
import parseMarkdownSync from "#/components/markdown/parse-markdown";
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
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: allDefinitions.map(({ title, body }) => ({
              "@type": "Question",
              name: title,
              acceptedAnswer: {
                "@type": "Answer",
                text: parseMarkdownSync(body).html,
              },
            })),
          }),
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
  );
}
