import { addOverlay, mapStyles, Overlay, SearchControl } from "carte-facile";
import maplibregl, { type GeoJSONSource } from "maplibre-gl";
import { useEffect, useId, useRef } from "react";
import type { IGeoCommune } from "#/clients/api-geo/interface";

interface ICollectiviteMapProps {
  geoCommune: IGeoCommune;
  onMapReady?: (map: maplibregl.Map) => void;
  onMapUnload?: () => void;
  withCadastre?: boolean;
  withSearch?: boolean;
}

const communeFillLayerId = "collectivite-commune-fill";
export const communeLineLayerId = "collectivite-commune-line";
const communeSourceId = "collectivite-commune";

interface CommuneContour {
  coordinates: [number, number][][];
  type: "Polygon";
}

function buildCommuneFeature(
  contour: CommuneContour
): GeoJSON.Feature<GeoJSON.Polygon> {
  return {
    geometry: contour,
    properties: {},
    type: "Feature",
  };
}

function getCommuneBounds(contour: CommuneContour) {
  const bounds = new maplibregl.LngLatBounds();

  for (const ring of contour.coordinates) {
    for (const coordinate of ring) {
      bounds.extend(coordinate);
    }
  }

  return bounds;
}

function drawCommuneOnMap(map: maplibregl.Map, contour: CommuneContour) {
  const communeFeature = buildCommuneFeature(contour);
  const source = map.getSource(communeSourceId) as GeoJSONSource | undefined;

  if (source) {
    source.setData(communeFeature);
  } else {
    map.addSource(communeSourceId, {
      data: communeFeature,
      type: "geojson",
    });
  }

  if (!map.getLayer(communeFillLayerId)) {
    map.addLayer({
      id: communeFillLayerId,
      paint: {
        "fill-color": "#000091",
        "fill-opacity": 0.16,
      },
      source: communeSourceId,
      type: "fill",
    });
  }

  if (!map.getLayer(communeLineLayerId)) {
    map.addLayer({
      id: communeLineLayerId,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#000091",
        "line-width": 3,
      },
      source: communeSourceId,
      type: "line",
    });
  }

  const bounds = getCommuneBounds(contour);

  if (!bounds.isEmpty()) {
    map.fitBounds(bounds, {
      duration: 0,
      maxZoom: 13,
      padding: 48,
    });
  }
}

export function CollectiviteMap({
  geoCommune,
  onMapReady,
  onMapUnload,
  withCadastre = false,
  withSearch = false,
}: ICollectiviteMapProps) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapContainerId = useId();

  useEffect(() => {
    // Création la carte
    const map = new maplibregl.Map({
      container: mapContainerId, // id du conteneur de la carte
      style: mapStyles.simple, // style de carte
      maxZoom: 18.9, // niveau de zoom maximum, adapté aux cartes utilisant les données IGN
    });

    mapRef.current = map;

    if (withSearch) {
      map.addControl(
        new SearchControl({
          placeholder: "Rechercher une adresse…",
          debounceMs: 300, // Délai avant déclenchement (ms)
          minChars: 3, // Nombre minimum de caractères
          maxResults: 5, // Nombre maximum de résultats affichés
        }),
        "top-right"
      );
    }

    map.addControl(new maplibregl.NavigationControl());

    addOverlay(
      map,
      withCadastre
        ? [Overlay.administrativeBoundaries, Overlay.cadastre]
        : Overlay.administrativeBoundaries
    );

    return () => {
      onMapUnload?.();
      mapRef.current = null;
      map.remove();
    };
  }, [mapContainerId, onMapUnload, withCadastre, withSearch]);

  useEffect(() => {
    if (!(geoCommune.contour && mapRef.current)) {
      return;
    }

    const map = mapRef.current;
    const drawCommune = () => {
      drawCommuneOnMap(map, geoCommune.contour);
      onMapReady?.(map);
    };

    if (map.isStyleLoaded()) {
      drawCommune();
    } else {
      map.once("load", drawCommune);
    }

    return () => {
      map.off("load", drawCommune);
      onMapUnload?.();
    };
  }, [geoCommune, onMapReady, onMapUnload]);

  return <div id={mapContainerId} style={{ height: "500px" }} />;
}
