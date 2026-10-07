import maplibregl, { type MapLayerMouseEvent } from "maplibre-gl";
import { useCallback, useMemo, useRef } from "react";
import type { IGeoCommune } from "#/clients/api-geo/interface";
import { CollectiviteMap } from "#/components/collectivite/map";
import { DataSectionClient } from "#/components/section/data-section";
import { useServerFnData } from "#/hooks/fetch/use-server-fn-data";
import { EAdministration } from "#/models/administrations/e-administration";
import type { ICollectiviteEtablissementSirene } from "#/models/collectivite/economie-locale";
import { getCollectiviteEtablissementsSireneFn } from "#/server-functions/public/data-fetching/collectivites";

const etablissementsSourceId = "collectivite-economie-locale-etablissements";
const etablissementsLayerId =
  "collectivite-economie-locale-etablissements-layer";

interface EtablissementFeatureProperties {
  nom: string;
  siret: string;
}

function hasValidCoordinates(etablissement: ICollectiviteEtablissementSirene) {
  if (etablissement.lat === null || etablissement.lon === null) {
    return false;
  }

  const lat = Number(etablissement.lat);
  const lon = Number(etablissement.lon);

  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}

function buildEtablissementFeature(
  etablissement: ICollectiviteEtablissementSirene
): GeoJSON.Feature<GeoJSON.Point, EtablissementFeatureProperties> {
  return {
    geometry: {
      coordinates: [Number(etablissement.lon), Number(etablissement.lat)],
      type: "Point",
    },
    properties: {
      nom: etablissement.nom,
      siret: etablissement.siret,
    },
    type: "Feature",
  };
}

function buildEtablissementsFeatureCollection(
  etablissements: ICollectiviteEtablissementSirene[]
): GeoJSON.FeatureCollection<GeoJSON.Point, EtablissementFeatureProperties> {
  return {
    features: etablissements
      .filter(hasValidCoordinates)
      .map(buildEtablissementFeature),
    type: "FeatureCollection",
  };
}

function buildEtablissementPopupContent({
  nom,
  siret,
}: EtablissementFeatureProperties) {
  const container = document.createElement("div");

  const title = document.createElement("strong");
  title.textContent = nom || "Établissement";
  container.append(title);

  container.append(document.createElement("br"));

  const link = document.createElement("a");
  link.href = `/etablissement/${siret}`;
  link.rel = "noreferrer noopener";
  link.target = "_blank";
  link.textContent = "Ouvrir la fiche établissement";
  container.append(link);

  return container;
}

function CollectiviteEtablissementsMap({
  etablissements,
  geoCommune,
}: {
  etablissements: ICollectiviteEtablissementSirene[];
  geoCommune: IGeoCommune;
}) {
  const cleanupEtablissementsLayerRef = useRef<(() => void) | null>(null);

  const cleanupEtablissementsLayer = useCallback(() => {
    cleanupEtablissementsLayerRef.current?.();
    cleanupEtablissementsLayerRef.current = null;
  }, []);

  const onMapLoad = useCallback(
    (map: maplibregl.Map) => {
      cleanupEtablissementsLayer();

      const featureCollection =
        buildEtablissementsFeatureCollection(etablissements);

      if (featureCollection.features.length === 0) {
        return;
      }

      map.addSource(etablissementsSourceId, {
        data: featureCollection,
        type: "geojson",
      });

      map.addLayer({
        id: etablissementsLayerId,
        paint: {
          "circle-color": "#000091",
          "circle-opacity": 0.86,
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 4, 15, 7],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 1.5,
        },
        source: etablissementsSourceId,
        type: "circle",
      });

      const onClick = (event: MapLayerMouseEvent) => {
        const feature = event.features?.[0];

        if (!feature?.properties) {
          return;
        }

        new maplibregl.Popup({ offset: 12 })
          .setLngLat(event.lngLat)
          .setDOMContent(
            buildEtablissementPopupContent(
              feature.properties as EtablissementFeatureProperties
            )
          )
          .addTo(map);
      };

      const onMouseEnter = () => {
        map.getCanvas().style.cursor = "pointer";
      };

      const onMouseLeave = () => {
        map.getCanvas().style.cursor = "";
      };

      map.on("click", etablissementsLayerId, onClick);
      map.on("mouseenter", etablissementsLayerId, onMouseEnter);
      map.on("mouseleave", etablissementsLayerId, onMouseLeave);

      cleanupEtablissementsLayerRef.current = () => {
        map.off("click", etablissementsLayerId, onClick);
        map.off("mouseenter", etablissementsLayerId, onMouseEnter);
        map.off("mouseleave", etablissementsLayerId, onMouseLeave);
        map.getCanvas().style.cursor = "";

        if (map.getLayer(etablissementsLayerId)) {
          map.removeLayer(etablissementsLayerId);
        }

        if (map.getSource(etablissementsSourceId)) {
          map.removeSource(etablissementsSourceId);
        }
      };
    },
    [cleanupEtablissementsLayer, etablissements]
  );

  return (
    <CollectiviteMap
      geoCommune={geoCommune}
      onMapReady={onMapLoad}
      onMapUnload={cleanupEtablissementsLayer}
    />
  );
}

export function CollectiviteEtablissementsSection({
  codeInsee,
  geoCommune,
}: {
  codeInsee: string;
  geoCommune: IGeoCommune;
}) {
  const input = useMemo(() => ({ codeInsee }), [codeInsee]);
  const etablissements = useServerFnData(
    getCollectiviteEtablissementsSireneFn,
    input
  );

  return (
    <DataSectionClient
      data={etablissements}
      id="economie-locale-etablissements"
      loadingMinHeight={500}
      notFoundInfo="Aucun établissement n’a été retrouvé pour cette commune."
      sources={[EAdministration.INSEE]}
      title="Établissements de la collectivité"
    >
      {({ etablissements }) => (
        <CollectiviteEtablissementsMap
          etablissements={etablissements}
          geoCommune={geoCommune}
        />
      )}
    </DataSectionClient>
  );
}
