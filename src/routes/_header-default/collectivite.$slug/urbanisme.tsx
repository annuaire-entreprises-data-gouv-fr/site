import { createFileRoute } from "@tanstack/react-router";
import { CollectiviteDVFSection } from "#/components/collectivite/urbanisme/dvf";
import { getCodeInseeToUse } from "#/utils/helpers/collectivites";
import { Route as CollectiviteRoute } from "./route";

export const Route = createFileRoute(
  "/_header-default/collectivite/$slug/urbanisme"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { uniteLegale, geoCommune } = CollectiviteRoute.useLoaderData();

  return (
    <CollectiviteDVFSection
      codeDepartement={geoCommune.departement.code}
      codeInsee={getCodeInseeToUse(uniteLegale.colter.codeInsee)}
    />
  );
}
