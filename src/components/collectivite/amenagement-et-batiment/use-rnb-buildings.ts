import maplibregl, { type MapLayerMouseEvent } from "maplibre-gl";
import { useCallback, useRef } from "react";
import { communeLineLayerId } from "../map";

const rnbBuildingsFillLayerId = "rnb-buildings-fill";
const rnbBuildingsLabelLayerId = "rnb-buildings-label";
const rnbBuildingsLineLayerId = "rnb-buildings-line";
const rnbBuildingsMinZoom = 16;
const rnbBuildingsSourceId = "rnb-buildings";
const rnbBuildingsSourceLayer = "default";
const rnbBuildingsTileUrl =
  "https://rnb-api.beta.gouv.fr/api/alpha/tiles/shapes/{x}/{y}/{z}.pbf";
const rnbBuildingsInteractiveLayerIds = [
  rnbBuildingsFillLayerId,
  rnbBuildingsLineLayerId,
  rnbBuildingsLabelLayerId,
];

export function useRnbBuildings() {
  const cleanupRef = useRef<(() => void) | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  const onMapUnload = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    mapRef.current = null;

    popupRef.current?.remove();
    popupRef.current = null;
  }, []);

  const onMapLoad = useCallback(
    (map: maplibregl.Map) => {
      if (!map.getSource(rnbBuildingsSourceId)) {
        map.addSource(rnbBuildingsSourceId, {
          minzoom: rnbBuildingsMinZoom,
          tiles: [rnbBuildingsTileUrl],
          type: "vector",
        });
      }

      if (!map.getLayer(rnbBuildingsFillLayerId)) {
        map.addLayer(
          {
            id: rnbBuildingsFillLayerId,
            minzoom: rnbBuildingsMinZoom,
            paint: {
              "fill-color": "#00a95f",
              "fill-opacity": 0.18,
            },
            source: rnbBuildingsSourceId,
            "source-layer": rnbBuildingsSourceLayer,
            type: "fill",
          },
          communeLineLayerId
        );
      }

      if (!map.getLayer(rnbBuildingsLineLayerId)) {
        map.addLayer(
          {
            id: rnbBuildingsLineLayerId,
            minzoom: rnbBuildingsMinZoom,
            paint: {
              "line-color": "#18753c",
              "line-opacity": 0.85,
              "line-width": 1.5,
            },
            source: rnbBuildingsSourceId,
            "source-layer": rnbBuildingsSourceLayer,
            type: "line",
          },
          communeLineLayerId
        );
      }

      if (!map.getLayer(rnbBuildingsLabelLayerId)) {
        map.addLayer({
          id: rnbBuildingsLabelLayerId,
          layout: {
            "text-field": ["get", "rnb_id"],
            "text-font": ["Noto Sans Regular"],
            "text-size": 10,
          },
          minzoom: rnbBuildingsMinZoom + 1,
          paint: {
            "text-color": "#161616",
            "text-halo-color": "#ffffff",
            "text-halo-width": 1,
          },
          source: rnbBuildingsSourceId,
          "source-layer": rnbBuildingsSourceLayer,
          type: "symbol",
        });
      }

      if (mapRef.current === map) {
        return;
      }

      onMapUnload();
      mapRef.current = map;

      const showBuildingPopup = (event: MapLayerMouseEvent) => {
        const rnbId = event.features?.[0]?.properties?.rnb_id;

        if (typeof rnbId !== "string" || rnbId.length === 0) {
          return;
        }

        popupRef.current?.remove();
        popupRef.current = new maplibregl.Popup({
          closeOnClick: true,
          offset: 8,
        })
          .setLngLat(event.lngLat)
          .setText(rnbId)
          .addTo(map);
      };

      const setPointerCursor = () => {
        map.getCanvas().style.cursor = "pointer";
      };

      const resetPointerCursor = () => {
        map.getCanvas().style.cursor = "";
      };

      map.on("click", rnbBuildingsInteractiveLayerIds, showBuildingPopup);
      map.on("mouseenter", rnbBuildingsInteractiveLayerIds, setPointerCursor);
      map.on("mouseleave", rnbBuildingsInteractiveLayerIds, resetPointerCursor);

      cleanupRef.current = () => {
        map.off("click", rnbBuildingsInteractiveLayerIds, showBuildingPopup);
        map.off(
          "mouseenter",
          rnbBuildingsInteractiveLayerIds,
          setPointerCursor
        );
        map.off(
          "mouseleave",
          rnbBuildingsInteractiveLayerIds,
          resetPointerCursor
        );
        resetPointerCursor();
      };
    },
    [onMapUnload]
  );

  return {
    onMapLoad,
    onMapUnload,
  };
}
