import { createFileRoute } from "@tanstack/react-router";
import { CollectiviteDVFSection } from "#/components/collectivite/urbanisme/dvf";
import { CollectiviteDVFMapSection } from "#/components/collectivite/urbanisme/dvf-map";
import { getCodeInseeToUse } from "#/utils/helpers/collectivites";
import { Route as CollectiviteRoute } from "./route";

export const Route = createFileRoute(
  "/_header-default/collectivite/$slug/urbanisme"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { uniteLegale, geoCommune } = CollectiviteRoute.useLoaderData();
  const codeInsee = getCodeInseeToUse(uniteLegale.colter.codeInsee);

  return (
    <>
      <CollectiviteDVFSection
        codeDepartement={geoCommune.departement.code}
        codeInsee={codeInsee}
      />
      <CollectiviteDVFMapSection
        codeDepartement={geoCommune.departement.code}
        codeInsee={codeInsee}
        geoCommune={geoCommune}
      />
    </>
  );
}
