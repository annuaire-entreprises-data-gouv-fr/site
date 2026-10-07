import { createFileRoute } from "@tanstack/react-router";
import { CollectiviteEconomieLocaleSection } from "#/components/collectivite/economie-locale";
import { CollectiviteEtablissementsSection } from "#/components/collectivite/economie-locale/etablissements";
import { CollectiviteFluxEtablissementsSection } from "#/components/collectivite/economie-locale/flux-etablissements";
import { Route as CollectiviteRoute } from "./route";

export const Route = createFileRoute(
  "/_header-default/collectivite/$slug/economie-locale"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { geoCommune, uniteLegale } = CollectiviteRoute.useLoaderData();
  const codeInsee = uniteLegale.colter.codeInsee;

  return (
    <>
      <CollectiviteEtablissementsSection
        codeInsee={codeInsee}
        geoCommune={geoCommune}
      />
      <CollectiviteEconomieLocaleSection codeInsee={codeInsee} />
      <CollectiviteFluxEtablissementsSection codeInsee={codeInsee} />
    </>
  );
}
