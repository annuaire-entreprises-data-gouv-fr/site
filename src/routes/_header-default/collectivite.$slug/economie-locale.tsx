import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  type CollectiviteEconomieLocaleEffectifsResponse,
  CollectiviteEconomieLocaleSection,
} from "#/components/collectivite/economie-locale";
import { CollectiviteMap } from "#/components/collectivite/map";
import { httpGet } from "#/utils/network";
import { Route as CollectiviteRoute } from "./route";

const loadRouteData = createServerFn().handler(async () => {
  const effectifs = await httpGet<CollectiviteEconomieLocaleEffectifsResponse>(
    "https://ade.s3.sbg.io.cloud.ovh.net/ae/dev/adc/13101.json"
  );

  return {
    effectifs,
  };
});

export const Route = createFileRoute(
  "/_header-default/collectivite/$slug/economie-locale"
)({
  component: RouteComponent,
  loader: async () => {
    const result = await loadRouteData();

    return result;
  },
});

function RouteComponent() {
  const { uniteLegale, geoCommune } = CollectiviteRoute.useLoaderData();
  const { effectifs } = Route.useLoaderData();

  return (
    <>
      <CollectiviteMap geoCommune={geoCommune} uniteLegale={uniteLegale} />
      <CollectiviteEconomieLocaleSection effectifs={effectifs} />
    </>
  );
}
