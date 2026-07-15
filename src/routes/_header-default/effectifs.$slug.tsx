import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import z from "zod";
import { NotFound } from "#/components/screens/not-found";
import Title from "#/components/title-section";
import { FICHE } from "#/components/title-section/tabs";
import UniteLegaleEffectifsAnnuelsSection from "#/components/unite-legale-effectifs-annuels-section";
import { natureEffectifAnnuelValues } from "#/components/unite-legale-effectifs-annuels-section/protected-effectifs-annuels-section";
import { useAuth } from "#/contexts/auth.context";
import { getUniteLegaleFromSlugFn } from "#/server-functions/public/unite-legale";
import { getUniteLegaleTheme } from "#/utils/get-unite-legale-theme";
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#/utils/helpers";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/_header-default/effectifs/$slug")({
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
    const canonical = `https://annuaire-entreprises.data.gouv.fr/effectifs/${uniteLegale.siren}`;
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
    <div className="content-container" style={getUniteLegaleTheme(uniteLegale)}>
      <Title
        ficheType={FICHE.EFFECTIFS}
        uniteLegale={uniteLegale}
        user={user}
      />
      <UniteLegaleEffectifsAnnuelsSection
        uniteLegale={uniteLegale}
        user={user}
      />
    </div>
  );
}
