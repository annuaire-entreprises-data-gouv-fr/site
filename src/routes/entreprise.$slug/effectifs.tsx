import {
  createFileRoute,
  notFound,
  stripSearchParams,
} from "@tanstack/react-router";
import z from "zod";
import { NotFound } from "#/components/screens/not-found";
import UniteLegaleEffectifsAnnuelsSection from "#/components/unite-legale-effectifs-annuels-section";
import { natureEffectifAnnuelValues } from "#/components/unite-legale-effectifs-annuels-section/protected-effectifs-annuels-section";
import { useAuth } from "#/contexts/auth.context";
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#/utils/helpers";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "../_header-default/-error";

export const Route = createFileRoute("/entreprise/$slug/effectifs")({
  validateSearch: z.object({
    "effectifs-annuels-nature-effectif": z
      .enum(natureEffectifAnnuelValues)
      .optional()
      .default("moyen")
      .catch("moyen"),
  }),
  search: {
    middlewares: [
      stripSearchParams({
        "effectifs-annuels-nature-effectif": "moyen",
      }),
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
    const canonical = `https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.siren}/effectifs`;
    return {
      meta: meta({
        title: `Effectifs - ${uniteLegalePageTitle(uniteLegale)}`,
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
    <UniteLegaleEffectifsAnnuelsSection uniteLegale={uniteLegale} user={user} />
  );
}
