import { createFileRoute } from "@tanstack/react-router";
import { CollectiviteDVFSection } from "#/components/collectivite/urbanisme/dvf";
import { Route as CollectiviteRoute } from "./route";

export const Route = createFileRoute(
  "/_header-default/collectivite/$slug/urbanisme"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { uniteLegale } = CollectiviteRoute.useLoaderData();

  return <CollectiviteDVFSection codeInsee={uniteLegale.colter.codeInsee} />;
}
