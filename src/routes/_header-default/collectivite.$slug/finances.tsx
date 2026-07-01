import { createFileRoute } from "@tanstack/react-router";
import { CollectiviteMarchePublicSection } from "#/components/collectivite/finances/marche-public-section";
import { Route as CollectiviteRoute } from "./route";

export const Route = createFileRoute(
  "/_header-default/collectivite/$slug/finances"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { geoCommune } = CollectiviteRoute.useLoaderData();

  return <CollectiviteMarchePublicSection geoCommune={geoCommune} />;
}
