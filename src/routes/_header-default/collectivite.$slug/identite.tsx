import { createFileRoute } from "@tanstack/react-router";
import { CollectiviteGeoSection } from "#/components/collectivite/identite/geo-section";
import { Route as CollectiviteRoute } from "./route";

export const Route = createFileRoute(
  "/_header-default/collectivite/$slug/identite"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { geoCommune } = CollectiviteRoute.useLoaderData();

  return <CollectiviteGeoSection geoCommune={geoCommune} />;
}
