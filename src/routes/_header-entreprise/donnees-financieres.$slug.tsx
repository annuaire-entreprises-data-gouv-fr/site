import {
  createFileRoute,
  notFound,
  stripSearchParams,
} from "@tanstack/react-router";
import z from "zod";
import DonneesFinancieresAssociation from "#/components/screens/donnees-financieres.$slug/donnees-financieres-association";
import DonneesFinancieresSociete from "#/components/screens/donnees-financieres.$slug/donnees-financieres-societe";
import { NotFound } from "#/components/screens/not-found";
import { useAuth } from "#/contexts/auth.context";
import { isAssociation } from "#/models/core/types";
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#/utils/helpers";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "../_header-default/-error";

export const Route = createFileRoute(
  "/_header-entreprise/donnees-financieres/$slug"
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
  shouldReload: true,
  loader: async ({ parentMatchPromise }) => {
    const { loaderData } = await parentMatchPromise;

    if (!loaderData) {
      throw notFound();
    }

    return loaderData;
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
    <>
      {isAssociation(uniteLegale) ? (
        <DonneesFinancieresAssociation uniteLegale={uniteLegale} user={user} />
      ) : (
        <DonneesFinancieresSociete uniteLegale={uniteLegale} user={user} />
      )}
    </>
  );
}
