import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import z from "zod";
import { CollectiviteMarchePublicSection } from "#/components/collectivite/finances/marche-public-section";
import { Route as CollectiviteRoute } from "./route";

export const Route = createFileRoute(
  "/_header-default/collectivite/$slug/finances"
)({
  validateSearch: z.object({
    "marches-publics-page": z.number().min(1).optional().default(1).catch(1),
  }),
  search: {
    middlewares: [stripSearchParams({ "marches-publics-page": 1 })],
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { uniteLegale } = CollectiviteRoute.useLoaderData();

  return <CollectiviteMarchePublicSection uniteLegale={uniteLegale} />;
}
