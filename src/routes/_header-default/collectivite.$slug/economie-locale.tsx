import { createFileRoute } from "@tanstack/react-router";
import { CollectiviteMap } from "#/components/collectivite/map";
import { Route as CollectiviteRoute } from "./route";

export const Route = createFileRoute(
  "/_header-default/collectivite/$slug/economie-locale"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { uniteLegale, geoCommune } = CollectiviteRoute.useLoaderData();

  return (
    <>
      <CollectiviteMap geoCommune={geoCommune} uniteLegale={uniteLegale} />
    </>
  );
}
