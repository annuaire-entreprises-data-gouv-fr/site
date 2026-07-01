import { useCallback } from "react";
import { communeLineLayerId } from "../map";

const rnbBuildingsFillLayerId = "rnb-buildings-fill";
const rnbBuildingsLabelLayerId = "rnb-buildings-label";
const rnbBuildingsLineLayerId = "rnb-buildings-line";
const rnbBuildingsMinZoom = 16;
const rnbBuildingsSourceId = "rnb-buildings";
const rnbBuildingsSourceLayer = "default";
const rnbBuildingsTileUrl =
  "https://rnb-api.beta.gouv.fr/api/alpha/tiles/shapes/{x}/{y}/{z}.pbf";

export function useRnbBuildings() {
  const onMapLoad = useCallback((map: maplibregl.Map) => {
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
  }, []);

  return {
    onMapLoad,
  };
}
