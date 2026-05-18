import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import z from "zod";
import DonneesFinancieresAssociation from "#/components/screens/donnees-financieres.$slug/donnees-financieres-association";
import DonneesFinancieresSociete from "#/components/screens/donnees-financieres.$slug/donnees-financieres-societe";
import { NotFound } from "#/components/screens/not-found";
import Title from "#/components/title-section";
import { FICHE } from "#/components/title-section/tabs";
import { useAuth } from "#/contexts/auth.context";
import { isAssociation } from "#/models/core/types";
import { getUniteLegaleFromSlugFn } from "#/server-functions/public/unite-legale";
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#/utils/helpers";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute(
  "/_header-default/donnees-financieres/$slug"
)({
  validateSearch: z.object({
    "aides-ademe-page": z.number().min(1).optional().default(1).catch(1),
    "aides-minimis-page": z.number().min(1).optional().default(1).catch(1),
  }),
  search: {
    middlewares: [
      stripSearchParams({ "aides-ademe-page": 1, "aides-minimis-page": 1 }),
    ],
  },
  loader: async ({ params }) => {
    const uniteLegale = await getUniteLegaleFromSlugFn({
      data: { slug: params.slug },
    });

    return { uniteLegale };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return meta.notFound();
    }

    const { uniteLegale } = loaderData;
    const canonical = `https://annuaire-entreprises.data.gouv.fr/donnees-financieres/${uniteLegale.siren}`;
    return {
      meta: meta({
        title: `Données financières - ${uniteLegalePageTitle(uniteLegale)}`,
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
  const { uniteLegale } = Route.useLoaderData();
  const { user } = useAuth();

  return (
    <div className="content-container">
      <Title ficheType={FICHE.FINANCES} uniteLegale={uniteLegale} user={user} />
      {isAssociation(uniteLegale) ? (
        <DonneesFinancieresAssociation uniteLegale={uniteLegale} user={user} />
      ) : (
        <DonneesFinancieresSociete uniteLegale={uniteLegale} user={user} />
      )}
    </div>
  );
}
