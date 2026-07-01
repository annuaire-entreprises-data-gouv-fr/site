import { createFileRoute } from "@tanstack/react-router";
import { useRnbBuildings } from "#/components/collectivite/amenagement-et-batiment/use-rnb-buildings";
import { CollectiviteMap } from "#/components/collectivite/map";
import { Section } from "#/components/section";
import { EAdministration } from "#/models/administrations/e-administration";
import { Route as CollectiviteRoute } from "./route";

export const Route = createFileRoute(
  "/_header-default/collectivite/$slug/amenagement-et-batiment"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { geoCommune } = CollectiviteRoute.useLoaderData();

  const { onMapLoad, onMapUnload } = useRnbBuildings();

  return (
    <Section
      id="rnb"
      sources={[EAdministration.DINUM]}
      title="Référentiel National des Bâtiments (RNB) et cadastre"
    >
      <p>
        Zoomez dans la commune pour afficher les bâtiments référencés par le RNB
        et leurs identifiants, ainsi que le cadastre.
      </p>
      <CollectiviteMap
        geoCommune={geoCommune}
        onMapReady={onMapLoad}
        onMapUnload={onMapUnload}
        withCadastre
        withSearch
      />
    </Section>
  );
}
