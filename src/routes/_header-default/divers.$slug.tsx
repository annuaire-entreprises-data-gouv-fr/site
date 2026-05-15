import { createFileRoute } from "@tanstack/react-router";
import ConventionsCollectivesSection from "#/components/conventions-collectives-section";
import { NotFound } from "#/components/screens/not-found";
import Title from "#/components/title-section";
import { FICHE } from "#/components/title-section/tabs";
import { useAuth } from "#/contexts/auth.context";
import { getAllIdccWithMetadata } from "#/models/conventions-collectives";
import { getRechercheEntrepriseSourcesLastModified } from "#/models/recherche-entreprise-modified";
import { getUniteLegaleFromSlugFn } from "#/server-functions/public/unite-legale";
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#/utils/helpers";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/_header-default/divers/$slug")({
  loader: async ({ params }) => {
    const [uniteLegale, sourcesLastModified] = await Promise.all([
      getUniteLegaleFromSlugFn({
        data: { slug: params.slug },
      }),
      getRechercheEntrepriseSourcesLastModified(),
    ]);
    const ccWithMetadata = await getAllIdccWithMetadata(uniteLegale.siren);

    return { uniteLegale, ccWithMetadata, sourcesLastModified };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return meta.notFound();
    }

    const { uniteLegale } = loaderData;
    const canonical = `https://annuaire-entreprises.data.gouv.fr/divers/${uniteLegale.siren}`;
    return {
      meta: meta({
        title: `Conventions collectives - ${uniteLegalePageTitle(uniteLegale)}`,
        description: uniteLegalePageDescription(uniteLegale),
        robots: "noindex",
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
  const { uniteLegale, ccWithMetadata, sourcesLastModified } =
    Route.useLoaderData();

  const { user } = useAuth();

  return (
    <div className="content-container">
      <Title ficheType={FICHE.DIVERS} uniteLegale={uniteLegale} user={user} />
      <ConventionsCollectivesSection
        ccLastModified={sourcesLastModified.idcc}
        ccWithMetadata={ccWithMetadata}
      />
    </div>
  );
}
