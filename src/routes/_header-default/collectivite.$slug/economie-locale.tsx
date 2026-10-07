import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import {
  clientCollectiviteEffectifsSalaries,
  clientCollectiviteEtablissementsSirene,
  clientCollectiviteFluxOuvertureEtablissements,
} from "#/clients/collectivite-economie-locale";
import { CollectiviteEconomieLocaleSection } from "#/components/collectivite/economie-locale";
import { CollectiviteEtablissementsSection } from "#/components/collectivite/economie-locale/etablissements";
import { CollectiviteFluxEtablissementsSection } from "#/components/collectivite/economie-locale/flux-etablissements";
import { Route as CollectiviteRoute } from "./route";

const loadRouteData = createServerFn()
  .validator(
    z.object({
      codeInsee: z.string().regex(/^(?:\d{5}|2[AB]\d{3})$/),
    })
  )
  .handler(async ({ data: { codeInsee } }) => {
    const [effectifs, etablissements, fluxEtablissements] = await Promise.all([
      clientCollectiviteEffectifsSalaries(codeInsee),
      clientCollectiviteEtablissementsSirene(codeInsee),
      clientCollectiviteFluxOuvertureEtablissements(codeInsee),
    ]);

    return { effectifs, etablissements, fluxEtablissements };
  });

export const Route = createFileRoute(
  "/_header-default/collectivite/$slug/economie-locale"
)({
  component: RouteComponent,
  loader: async ({ parentMatchPromise }) => {
    const { loaderData } = await parentMatchPromise;

    if (!loaderData) {
      throw notFound();
    }

    return await loadRouteData({
      data: { codeInsee: loaderData.uniteLegale.colter.codeInsee },
    });
  },
});

function RouteComponent() {
  const { geoCommune } = CollectiviteRoute.useLoaderData();
  const { effectifs, etablissements, fluxEtablissements } =
    Route.useLoaderData();

  return (
    <>
      <CollectiviteEtablissementsSection
        etablissements={etablissements}
        geoCommune={geoCommune}
      />
      <CollectiviteEconomieLocaleSection effectifs={effectifs} />
      <CollectiviteFluxEtablissementsSection
        fluxEtablissements={fluxEtablissements}
      />
    </>
  );
}
