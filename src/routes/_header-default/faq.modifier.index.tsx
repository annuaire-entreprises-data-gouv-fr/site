import { createFileRoute } from "@tanstack/react-router";
import { Link } from "#/components/Link";
import TextWrapper from "#/components-ui/text-wrapper";
import { allDataToModify } from "#/models/administrations/data-to-modify";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/_header-default/faq/modifier/")({
  head: () => {
    const canonical = "https://annuaire-entreprises.data.gouv.fr/faq/modifier";
    return {
      meta: meta({
        title:
          "FAQ : modifier une information présente sur l’Annuaire des Entreprises",
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
  return (
    <TextWrapper>
      <h1>Comment modifier les informations d’une entreprise ?</h1>
      Quelle information souhaitez vous modifier :
      <ul>
        {allDataToModify.map(({ label, slug }) => (
          <li key={slug}>
            <Link params={{ slug }} to="/faq/modifier/$slug">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </TextWrapper>
  );
}
