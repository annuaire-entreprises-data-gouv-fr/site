import { type QueryClient, useQueryClient } from "@tanstack/react-query";
import type maplibregl from "maplibre-gl";
import type {
  ExpressionSpecification,
  FilterSpecification,
  MapLayerMouseEvent,
} from "maplibre-gl";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  aggregateDVFMutations,
  getEcartReference,
  getLocalReferencePrices,
  getVentesParParcelle,
  type IDVFMutationRow,
  type IDVFReferencePrices,
  type IDVFVente,
  median,
} from "#/models/collectivite/dvf-mutations";
import { communeLineLayerId } from "../map";
import {
  type DVFColorMode,
  type DVFTypeFilter,
  dvfColorModeFillColors,
} from "./dvf-map-legend";

const dvfSourceId = "dvf-parcelles";
const dvfSourceLayer = "parcelles";
const dvfTileUrl =
  "https://openmaptiles.geo.data.gouv.fr/data/cadastre-dvf/{z}/{x}/{y}.pbf";
const dvfMutationsApiUrl = "https://dvf-api.data.gouv.fr/mutations";
const dvfOutlineLayerId = "dvf-parcelles-outline";
const dvfFillLayerId = "dvf-parcelles-fill";
const dvfLineLayerId = "dvf-parcelles-line";
const dvfHighlightLayerId = "dvf-parcelles-highlight";
const dvfInteractiveLayerIds = [dvfFillLayerId, dvfLineLayerId];
const dvfDetailsPanelCameraOffset: [number, number] = [192, 0];

/** Les parcelles ne sont présentes dans les tuiles qu'à partir du zoom 13 */
export const dvfParcellesMinZoom = 13;
/** Zoom minimal pour colorer les parcelles selon leur prix */
export const dvfPriceMinZoom = 15;
/** Nombre maximal de sections chargées simultanément pour le mode prix */
const dvfPriceMaxSections = 24;

export interface IDVFParcelle {
  commune: string;
  contenance: number | null;
  id: string;
  section: string;
}

export type DVFParcelleSelection =
  | { state: "idle" }
  | { parcelle: IDVFParcelle; state: "loading" }
  | { parcelle: IDVFParcelle; state: "error" }
  | {
      parcelle: IDVFParcelle;
      sectionVentes: IDVFVente[];
      state: "loaded";
      ventes: IDVFVente[];
    };

export type DVFPriceStatus =
  | "disabled"
  | "zoom"
  | "too-many"
  | "loading"
  | "ready"
  | "error";

function getSectionKey(commune: string, section: string) {
  return `${commune}/${section}`;
}

async function fetchSectionVentes(commune: string, section: string) {
  const response = await fetch(
    `${dvfMutationsApiUrl}/${encodeURIComponent(commune)}/${encodeURIComponent(section)}`
  );
  if (!response.ok) {
    throw new Error(`Unable to fetch DVF mutations ${commune}/${section}`);
  }
  const { data } = (await response.json()) as { data: IDVFMutationRow[] };
  return aggregateDVFMutations(data);
}

function getSectionVentes(
  queryClient: QueryClient,
  commune: string,
  section: string
) {
  return queryClient.fetchQuery({
    queryKey: ["dvf-mutations", commune, section],
    queryFn: () => fetchSectionVentes(commune, section),
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: 30 * 60 * 1000,
  });
}

function getParcelleFromFeature(
  properties: Record<string, unknown> | undefined
): IDVFParcelle | null {
  const id = properties?.id;
  if (typeof id !== "string" || id.length < 10) {
    return null;
  }
  const commune =
    typeof properties?.commune === "string"
      ? properties.commune
      : id.slice(0, 5);
  return {
    id,
    commune,
    section: id.slice(5, 10),
    contenance:
      typeof properties?.contenance === "number" ? properties.contenance : null,
  };
}

const typeFilterProperty: Record<Exclude<DVFTypeFilter, "tous">, string> = {
  maison: "vente_maison",
  appartement: "vente_appartement",
  local: "vente_local",
};

function buildParcellesFilter(
  communeCodes: string[],
  typeFilter: DVFTypeFilter
): FilterSpecification {
  return [
    "all",
    ["in", ["get", "commune"], ["literal", communeCodes]],
    ["==", ["get", "dvf"], "t"],
    typeFilter === "tous"
      ? true
      : ["==", ["get", typeFilterProperty[typeFilter]], "t"],
  ];
}

function matchesTypeFilter(vente: IDVFVente, typeFilter: DVFTypeFilter) {
  return typeFilter === "tous" || vente.categorie === typeFilter;
}

export function filterVentes(ventes: IDVFVente[], typeFilter: DVFTypeFilter) {
  return ventes.filter((vente) => matchesTypeFilter(vente, typeFilter));
}

const highlightLineColor: ExpressionSpecification = [
  "case",
  ["boolean", ["feature-state", "selected"], false],
  "#000091",
  "#e1000f",
];

export function useDVFMap({
  communeCodes,
  communeReferences,
}: {
  communeCodes: string[];
  communeReferences: IDVFReferencePrices | null;
}) {
  const queryClient = useQueryClient();
  const mapRef = useRef<maplibregl.Map | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const requestIdRef = useRef(0);
  const priceRequestIdRef = useRef(0);
  const highlightedIdsRef = useRef<string[]>([]);
  const pricedIdsRef = useRef<Set<string>>(new Set());
  const loadedSectionsRef = useRef<Map<string, IDVFVente[]>>(new Map());

  const [typeFilter, setTypeFilter] = useState<DVFTypeFilter>("tous");
  const [colorMode, setColorMode] = useState<DVFColorMode>("type");
  const [zoom, setZoom] = useState<number | null>(null);
  const [priceStatus, setPriceStatus] = useState<DVFPriceStatus>("disabled");
  const [selection, setSelection] = useState<DVFParcelleSelection>({
    state: "idle",
  });
  const [references, setReferences] = useState<IDVFReferencePrices | null>(
    communeReferences
  );

  const typeFilterRef = useRef(typeFilter);
  const colorModeRef = useRef(colorMode);
  const communeCodesRef = useRef(communeCodes);
  const communeReferencesRef = useRef(communeReferences);
  typeFilterRef.current = typeFilter;
  colorModeRef.current = colorMode;
  communeCodesRef.current = communeCodes;
  communeReferencesRef.current = communeReferences;

  const setHighlightedParcelles = useCallback(
    (map: maplibregl.Map, selectedId: string | null, linkedIds: string[]) => {
      for (const id of highlightedIdsRef.current) {
        for (const key of ["highlighted", "selected"]) {
          map.removeFeatureState(
            { source: dvfSourceId, sourceLayer: dvfSourceLayer, id },
            key
          );
        }
      }
      const ids = new Set(linkedIds);
      if (selectedId) {
        ids.add(selectedId);
      }
      for (const id of ids) {
        map.setFeatureState(
          { source: dvfSourceId, sourceLayer: dvfSourceLayer, id },
          { highlighted: true, selected: id === selectedId }
        );
      }
      highlightedIdsRef.current = [...ids];
    },
    []
  );

  const clearSelection = useCallback(() => {
    requestIdRef.current += 1;
    setSelection({ state: "idle" });
    if (mapRef.current) {
      setHighlightedParcelles(mapRef.current, null, []);
    }
  }, [setHighlightedParcelles]);

  /** Applique l'écart au prix de référence sur chaque parcelle chargée */
  const applyPriceStates = useCallback(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    const allVentes = [...loadedSectionsRef.current.values()].flat();
    const localReferences = getLocalReferencePrices(allVentes);
    const communeRefs = communeReferencesRef.current;
    const mergedReferences: IDVFReferencePrices = {
      maison: communeRefs?.maison ?? localReferences.maison,
      appartement: communeRefs?.appartement ?? localReferences.appartement,
      local: communeRefs?.local ?? localReferences.local,
    };
    setReferences(mergedReferences);

    const pricedIds = new Set<string>();
    for (const ventes of loadedSectionsRef.current.values()) {
      const byParcelle = getVentesParParcelle(
        filterVentes(ventes, typeFilterRef.current)
      );
      for (const [parcelleId, parcelleVentes] of byParcelle) {
        const ecart = median(
          parcelleVentes
            .map((vente) => getEcartReference(vente, mergedReferences))
            .filter((value): value is number => value !== null)
        );
        if (ecart === null) {
          continue;
        }
        map.setFeatureState(
          { source: dvfSourceId, sourceLayer: dvfSourceLayer, id: parcelleId },
          { ecart }
        );
        pricedIds.add(parcelleId);
      }
    }
    for (const id of pricedIdsRef.current) {
      if (!pricedIds.has(id)) {
        map.removeFeatureState(
          { source: dvfSourceId, sourceLayer: dvfSourceLayer, id },
          "ecart"
        );
      }
    }
    pricedIdsRef.current = pricedIds;
  }, []);

  const loadVisibleSections = useCallback(() => {
    const map = mapRef.current;
    if (!map || colorModeRef.current !== "prix") {
      return;
    }
    if (map.getZoom() < dvfPriceMinZoom) {
      setPriceStatus("zoom");
      return;
    }

    const sections = new Map<string, { commune: string; section: string }>();
    for (const feature of map.queryRenderedFeatures({
      layers: [dvfFillLayerId],
    })) {
      const parcelle = getParcelleFromFeature(feature.properties);
      if (parcelle) {
        sections.set(getSectionKey(parcelle.commune, parcelle.section), {
          commune: parcelle.commune,
          section: parcelle.section,
        });
      }
    }

    const missing = [...sections.entries()].filter(
      ([key]) => !loadedSectionsRef.current.has(key)
    );
    if (missing.length === 0) {
      applyPriceStates();
      setPriceStatus("ready");
      return;
    }
    if (missing.length > dvfPriceMaxSections) {
      applyPriceStates();
      setPriceStatus("too-many");
      return;
    }

    priceRequestIdRef.current += 1;
    const requestId = priceRequestIdRef.current;
    setPriceStatus("loading");
    Promise.allSettled(
      missing.map(async ([key, { commune, section }]) => {
        const ventes = await getSectionVentes(queryClient, commune, section);
        loadedSectionsRef.current.set(key, ventes);
      })
    ).then((results) => {
      if (priceRequestIdRef.current !== requestId || !mapRef.current) {
        return;
      }
      applyPriceStates();
      setPriceStatus(
        results.every(({ status }) => status === "rejected") ? "error" : "ready"
      );
    });
  }, [applyPriceStates, queryClient]);

  const scheduleTimeoutRef = useRef<number | null>(null);
  const scheduleLoadVisibleSections = useCallback(() => {
    if (scheduleTimeoutRef.current !== null) {
      window.clearTimeout(scheduleTimeoutRef.current);
    }
    scheduleTimeoutRef.current = window.setTimeout(() => {
      scheduleTimeoutRef.current = null;
      loadVisibleSections();
    }, 250);
  }, [loadVisibleSections]);

  const selectParcelle = useCallback(
    (
      map: maplibregl.Map,
      parcelle: IDVFParcelle,
      lngLat?: maplibregl.LngLat
    ) => {
      requestIdRef.current += 1;
      const requestId = requestIdRef.current;
      setSelection({ parcelle, state: "loading" });
      setHighlightedParcelles(map, parcelle.id, []);
      if (lngLat) {
        map.easeTo({
          center: lngLat,
          duration: 350,
          essential: true,
          offset: dvfDetailsPanelCameraOffset,
        });
      }

      getSectionVentes(queryClient, parcelle.commune, parcelle.section)
        .then((sectionVentes) => {
          if (requestIdRef.current !== requestId) {
            return;
          }
          loadedSectionsRef.current.set(
            getSectionKey(parcelle.commune, parcelle.section),
            sectionVentes
          );
          const ventes = sectionVentes.filter((vente) =>
            vente.parcelles.includes(parcelle.id)
          );
          const linkedIds = ventes.flatMap(({ parcelles }) => parcelles);
          setHighlightedParcelles(map, parcelle.id, linkedIds);
          if (colorModeRef.current === "prix") {
            applyPriceStates();
          }
          setSelection({ parcelle, sectionVentes, state: "loaded", ventes });
        })
        .catch(() => {
          if (requestIdRef.current !== requestId) {
            return;
          }
          setSelection({ parcelle, state: "error" });
        });
    },
    [applyPriceStates, queryClient, setHighlightedParcelles]
  );

  const onMapUnload = useCallback(() => {
    if (scheduleTimeoutRef.current !== null) {
      window.clearTimeout(scheduleTimeoutRef.current);
      scheduleTimeoutRef.current = null;
    }
    requestIdRef.current += 1;
    priceRequestIdRef.current += 1;
    cleanupRef.current?.();
    cleanupRef.current = null;
    mapRef.current = null;
    highlightedIdsRef.current = [];
    pricedIdsRef.current = new Set();
    setSelection({ state: "idle" });
  }, []);

  const onMapLoad = useCallback(
    (map: maplibregl.Map) => {
      const filter = buildParcellesFilter(
        communeCodesRef.current,
        typeFilterRef.current
      );

      if (!map.getSource(dvfSourceId)) {
        map.addSource(dvfSourceId, {
          attribution:
            '<a href="https://cadastre.data.gouv.fr/">DINUM (data.gouv.fr)</a> — DVF DGFiP',
          maxzoom: 16,
          minzoom: 11,
          promoteId: { [dvfSourceLayer]: "id" },
          tiles: [dvfTileUrl],
          type: "vector",
        });
      }

      if (!map.getLayer(dvfOutlineLayerId)) {
        map.addLayer(
          {
            id: dvfOutlineLayerId,
            filter: [
              "in",
              ["get", "commune"],
              ["literal", communeCodesRef.current],
            ],
            minzoom: 15,
            paint: {
              "line-color": "#929292",
              "line-opacity": 0.5,
              "line-width": 0.5,
            },
            source: dvfSourceId,
            "source-layer": dvfSourceLayer,
            type: "line",
          },
          communeLineLayerId
        );
      }

      if (!map.getLayer(dvfFillLayerId)) {
        map.addLayer(
          {
            id: dvfFillLayerId,
            filter,
            minzoom: dvfParcellesMinZoom,
            paint: {
              "fill-color": dvfColorModeFillColors[colorModeRef.current],
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                0.9,
                0.6,
              ],
            },
            source: dvfSourceId,
            "source-layer": dvfSourceLayer,
            type: "fill",
          },
          communeLineLayerId
        );
      }

      if (!map.getLayer(dvfLineLayerId)) {
        map.addLayer(
          {
            id: dvfLineLayerId,
            filter,
            minzoom: dvfParcellesMinZoom,
            paint: {
              "line-color": "#ffffff",
              "line-opacity": 0.8,
              "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                13,
                0.3,
                17,
                1,
              ],
            },
            source: dvfSourceId,
            "source-layer": dvfSourceLayer,
            type: "line",
          },
          communeLineLayerId
        );
      }

      if (!map.getLayer(dvfHighlightLayerId)) {
        map.addLayer({
          id: dvfHighlightLayerId,
          minzoom: dvfParcellesMinZoom,
          paint: {
            "line-color": highlightLineColor,
            "line-opacity": [
              "case",
              ["boolean", ["feature-state", "highlighted"], false],
              1,
              0,
            ],
            "line-width": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              3,
              2,
            ],
          },
          source: dvfSourceId,
          "source-layer": dvfSourceLayer,
          type: "line",
        });
      }

      if (mapRef.current === map) {
        return;
      }

      cleanupRef.current?.();
      mapRef.current = map;
      setZoom(map.getZoom());

      const onClick = (event: MapLayerMouseEvent) => {
        const parcelle = getParcelleFromFeature(
          event.features?.[0]?.properties
        );
        if (parcelle) {
          selectParcelle(map, parcelle, event.lngLat);
        }
      };
      const setPointerCursor = () => {
        map.getCanvas().style.cursor = "pointer";
      };
      const resetPointerCursor = () => {
        map.getCanvas().style.cursor = "";
      };
      const onZoomEnd = () => {
        setZoom(map.getZoom());
      };
      const onMoveEnd = () => {
        scheduleLoadVisibleSections();
      };
      // Les tuiles du mode prix peuvent arriver après la fin du déplacement
      const onSourceData = (event: maplibregl.MapSourceDataEvent) => {
        if (
          event.sourceId === dvfSourceId &&
          event.isSourceLoaded &&
          colorModeRef.current === "prix"
        ) {
          scheduleLoadVisibleSections();
        }
      };

      map.on("click", dvfInteractiveLayerIds, onClick);
      map.on("mouseenter", dvfInteractiveLayerIds, setPointerCursor);
      map.on("mouseleave", dvfInteractiveLayerIds, resetPointerCursor);
      map.on("zoomend", onZoomEnd);
      map.on("moveend", onMoveEnd);
      map.on("sourcedata", onSourceData);

      cleanupRef.current = () => {
        map.off("click", dvfInteractiveLayerIds, onClick);
        map.off("mouseenter", dvfInteractiveLayerIds, setPointerCursor);
        map.off("mouseleave", dvfInteractiveLayerIds, resetPointerCursor);
        map.off("zoomend", onZoomEnd);
        map.off("moveend", onMoveEnd);
        map.off("sourcedata", onSourceData);
        resetPointerCursor();
      };
    },
    [scheduleLoadVisibleSections, selectParcelle]
  );

  // Filtre par type de bien
  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer(dvfFillLayerId)) {
      return;
    }
    const filter = buildParcellesFilter(communeCodes, typeFilter);
    map.setFilter(dvfFillLayerId, filter);
    map.setFilter(dvfLineLayerId, filter);
    if (colorModeRef.current === "prix") {
      applyPriceStates();
    }
  }, [applyPriceStates, communeCodes, typeFilter]);

  // Mode de coloration
  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer(dvfFillLayerId)) {
      return;
    }
    map.setPaintProperty(
      dvfFillLayerId,
      "fill-color",
      dvfColorModeFillColors[colorMode]
    );
    if (colorMode === "prix") {
      loadVisibleSections();
    } else {
      priceRequestIdRef.current += 1;
      setPriceStatus("disabled");
    }
  }, [colorMode, loadVisibleSections]);

  useEffect(() => {
    setReferences(communeReferences);
    if (colorModeRef.current === "prix") {
      applyPriceStates();
    }
  }, [applyPriceStates, communeReferences]);

  // Redimensionne la carte quand le panneau s'ouvre ou se ferme
  const selectionState = selection.state;
  useEffect(() => {
    const map = mapRef.current;
    if (!(map && selectionState)) {
      return;
    }
    const frame = window.requestAnimationFrame(() => map.resize());
    return () => window.cancelAnimationFrame(frame);
  }, [selectionState]);

  const zoomToParcelles = useCallback(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    map.easeTo({
      zoom: Math.max(map.getZoom(), dvfPriceMinZoom),
      duration: 500,
      essential: true,
    });
  }, []);

  return {
    clearSelection,
    colorMode,
    onMapLoad,
    onMapUnload,
    priceStatus,
    references,
    selection,
    setColorMode,
    setTypeFilter,
    typeFilter,
    zoom,
    zoomToParcelles,
  };
}
