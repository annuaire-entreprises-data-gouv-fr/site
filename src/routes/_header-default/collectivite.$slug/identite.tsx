import { createFileRoute } from "@tanstack/react-router";
import maplibregl from "maplibre-gl";
import { useCallback, useRef } from "react";
import { CollectiviteGeoSection } from "#/components/collectivite/identite/geo-section";
import { CollectiviteMap } from "#/components/collectivite/map";
import { Route as CollectiviteRoute } from "./route";

export const Route = createFileRoute(
  "/_header-default/collectivite/$slug/identite"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { geoCommune } = CollectiviteRoute.useLoaderData();
  const mairieMarkerRef = useRef<maplibregl.Marker | null>(null);

  const onMapReady = useCallback(
    (map: maplibregl.Map) => {
      mairieMarkerRef.current?.remove();
      mairieMarkerRef.current = new maplibregl.Marker({ color: "#000091" })
        .setLngLat(geoCommune.mairie.coordinates)
        .setPopup(
          new maplibregl.Popup({ offset: 16 }).setText(
            `Mairie de ${geoCommune.nom}`
          )
        )
        .addTo(map);
    },
    [geoCommune]
  );

  const onMapUnload = useCallback(() => {
    mairieMarkerRef.current?.remove();
    mairieMarkerRef.current = null;
  }, []);

  return (
    <>
      <CollectiviteMap
        geoCommune={geoCommune}
        onMapReady={onMapReady}
        onMapUnload={onMapUnload}
      />
      <CollectiviteGeoSection geoCommune={geoCommune} />
    </>
  );
}
