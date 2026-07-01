import type maplibregl from "maplibre-gl";
import type { MapLayerMouseEvent } from "maplibre-gl";
import { useCallback, useEffect, useRef, useState } from "react";
import { communeLineLayerId } from "../map";

const rnbBuildingsFillLayerId = "rnb-buildings-fill";
const rnbBuildingsIconId = "rnb-building-icon";
const rnbBuildingsIconLayerId = "rnb-buildings-icon";
const rnbBuildingsLineLayerId = "rnb-buildings-line";
const rnbBuildingsMinZoom = 16;
const rnbBuildingsSourceId = "rnb-buildings";
const rnbBuildingsSourceLayer = "default";
const rnbBuildingsTileUrl =
  "https://rnb-api.beta.gouv.fr/api/alpha/tiles/shapes/{x}/{y}/{z}.pbf";
const rnbBuildingsInteractiveLayerIds = [
  rnbBuildingsFillLayerId,
  rnbBuildingsLineLayerId,
  rnbBuildingsIconLayerId,
];
const rnbBuildingApiUrl = "https://rnb-api.beta.gouv.fr/api/alpha/buildings";
const rnbDetailsPanelCameraOffset: [number, number] = [176, 0];

export interface RnbBuildingAddress {
  city_name?: string | null;
  city_zipcode?: string | null;
  id?: string | null;
  source?: string | null;
  street?: string | null;
  street_number?: string | null;
  street_rep?: string | null;
}

export interface RnbBuildingExternalId {
  id?: string | null;
  source?: string | null;
  source_version?: string | null;
}

export interface RnbBuildingPlot {
  bdg_cover_ratio?: number | null;
  id?: string | null;
}

export interface RnbBuilding {
  addresses?: RnbBuildingAddress[];
  ext_ids?: RnbBuildingExternalId[];
  is_active?: boolean;
  plots?: RnbBuildingPlot[];
  rnb_id?: string;
  status?: string;
}

export type RnbBuildingSelection =
  | { state: "idle" }
  | { rnbId: string; state: "loading" }
  | { rnbId: string; state: "error" }
  | { building: RnbBuilding; rnbId: string; state: "loaded" };

function buildRnbBuildingUrl(rnbId: string) {
  return `${rnbBuildingApiUrl}/${encodeURIComponent(rnbId)}/?withPlots=1`;
}

async function fetchRnbBuilding(rnbId: string, signal: AbortSignal) {
  const response = await fetch(buildRnbBuildingUrl(rnbId), { signal });

  if (!response.ok) {
    throw new Error(`Unable to fetch RNB building ${rnbId}`);
  }

  return response.json() as Promise<RnbBuilding>;
}

function fillIconRect(
  data: Uint8Array,
  iconWidth: number,
  x: number,
  y: number,
  width: number,
  height: number,
  color: [number, number, number, number]
) {
  for (let currentY = y; currentY < y + height; currentY += 1) {
    for (let currentX = x; currentX < x + width; currentX += 1) {
      const offset = (currentY * iconWidth + currentX) * 4;
      data[offset] = color[0];
      data[offset + 1] = color[1];
      data[offset + 2] = color[2];
      data[offset + 3] = color[3];
    }
  }
}

function createRnbBuildingIcon() {
  const width = 32;
  const height = 32;
  const data = new Uint8Array(width * height * 4);
  const blueFrance = [0, 0, 145, 255] as [number, number, number, number];
  const white = [255, 255, 255, 240] as [number, number, number, number];

  fillIconRect(data, width, 10, 4, 12, 6, white);
  fillIconRect(data, width, 7, 9, 18, 20, white);
  fillIconRect(data, width, 11, 5, 10, 5, blueFrance);
  fillIconRect(data, width, 8, 10, 16, 18, blueFrance);

  for (const x of [11, 17]) {
    for (const y of [13, 18]) {
      fillIconRect(data, width, x, y, 4, 3, white);
    }
  }

  fillIconRect(data, width, 14, 23, 4, 5, white);

  return {
    data,
    height,
    width,
  };
}

export function useRnbBuildings() {
  const abortControllerRef = useRef<AbortController | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const requestIdRef = useRef(0);
  const [selectedBuilding, setSelectedBuilding] =
    useState<RnbBuildingSelection>({
      state: "idle",
    });
  const mapResizeKey = selectedBuilding.state;

  const abortCurrentRequest = useCallback(() => {
    requestIdRef.current += 1;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);

  const clearSelectedBuilding = useCallback(() => {
    abortCurrentRequest();
    setSelectedBuilding({ state: "idle" });
  }, [abortCurrentRequest]);

  useEffect(() => {
    const map = mapRef.current;

    if (!(map && mapResizeKey)) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      map.resize();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [mapResizeKey]);

  const onMapUnload = useCallback(() => {
    abortCurrentRequest();
    cleanupRef.current?.();
    cleanupRef.current = null;
    mapRef.current = null;
    setSelectedBuilding({ state: "idle" });
  }, [abortCurrentRequest]);

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

      if (!map.hasImage(rnbBuildingsIconId)) {
        map.addImage(rnbBuildingsIconId, createRnbBuildingIcon(), {
          pixelRatio: 2,
        });
      }

      if (!map.getLayer(rnbBuildingsIconLayerId)) {
        map.addLayer({
          id: rnbBuildingsIconLayerId,
          layout: {
            "icon-allow-overlap": false,
            "icon-image": rnbBuildingsIconId,
            "icon-size": 2,
          },
          minzoom: rnbBuildingsMinZoom + 1,
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

      const selectBuilding = (event: MapLayerMouseEvent) => {
        const rnbId = event.features?.[0]?.properties?.rnb_id;

        if (typeof rnbId !== "string" || rnbId.length === 0) {
          return;
        }

        abortCurrentRequest();
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        requestIdRef.current += 1;
        const requestId = requestIdRef.current;
        setSelectedBuilding({ rnbId, state: "loading" });
        map.easeTo({
          center: event.lngLat,
          duration: 350,
          essential: true,
          offset: rnbDetailsPanelCameraOffset,
        });

        fetchRnbBuilding(rnbId, abortController.signal)
          .then((building) => {
            if (
              abortController.signal.aborted ||
              requestIdRef.current !== requestId
            ) {
              return;
            }

            setSelectedBuilding({ building, rnbId, state: "loaded" });
            abortControllerRef.current = null;
          })
          .catch(() => {
            if (
              abortController.signal.aborted ||
              requestIdRef.current !== requestId
            ) {
              return;
            }

            setSelectedBuilding({ rnbId, state: "error" });
            abortControllerRef.current = null;
          });
      };

      const setPointerCursor = () => {
        map.getCanvas().style.cursor = "pointer";
      };

      const resetPointerCursor = () => {
        map.getCanvas().style.cursor = "";
      };

      map.on("click", rnbBuildingsInteractiveLayerIds, selectBuilding);
      map.on("mouseenter", rnbBuildingsInteractiveLayerIds, setPointerCursor);
      map.on("mouseleave", rnbBuildingsInteractiveLayerIds, resetPointerCursor);

      cleanupRef.current = () => {
        map.off("click", rnbBuildingsInteractiveLayerIds, selectBuilding);
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
    [abortCurrentRequest, onMapUnload]
  );

  return {
    clearSelectedBuilding,
    onMapLoad,
    onMapUnload,
    selectedBuilding,
  };
}
