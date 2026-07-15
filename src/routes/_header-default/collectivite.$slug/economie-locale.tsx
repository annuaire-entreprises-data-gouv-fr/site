import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import maplibregl, { type MapLayerMouseEvent } from "maplibre-gl";
import { useCallback, useRef } from "react";
import {
  type CollectiviteEconomieLocaleEffectifsResponse,
  CollectiviteEconomieLocaleSection,
} from "#/components/collectivite/economie-locale";
import { CollectiviteMap } from "#/components/collectivite/map";
import { Section } from "#/components/section";
import { EAdministration } from "#/models/administrations/e-administration";
import { httpGet } from "#/utils/network";
import { Route as CollectiviteRoute } from "./route";

const etablissementsSourceId = "collectivite-economie-locale-etablissements";
const etablissementsLayerId =
  "collectivite-economie-locale-etablissements-layer";

type EtablissementSirene =
  CollectiviteEconomieLocaleEffectifsResponse["etablissements_sirene"][number];

interface EtablissementFeatureProperties {
  nom: string;
  siret: string;
}

function hasValidCoordinates(etablissement: EtablissementSirene) {
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
  etablissement: EtablissementSirene
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
  etablissements: EtablissementSirene[]
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

const loadRouteData = createServerFn().handler(async () => {
  const effectifs = await httpGet<CollectiviteEconomieLocaleEffectifsResponse>(
    "https://ade.s3.sbg.io.cloud.ovh.net/ae/dev/adc/44109.json"
    // "https://ade.s3.sbg.io.cloud.ovh.net/ae/dev/adc/13101.json"
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
  const { geoCommune } = CollectiviteRoute.useLoaderData();
  const { effectifs } = Route.useLoaderData();
  const cleanupEtablissementsLayerRef = useRef<(() => void) | null>(null);

  const cleanupEtablissementsLayer = useCallback(() => {
    cleanupEtablissementsLayerRef.current?.();
    cleanupEtablissementsLayerRef.current = null;
  }, []);

  const onMapLoad = useCallback(
    (map: maplibregl.Map) => {
      cleanupEtablissementsLayer();

      const etablissements = effectifs.etablissements_sirene ?? [];
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
    [cleanupEtablissementsLayer, effectifs]
  );

  return (
    <>
      <Section
        id="economie-locale-etablissements"
        sources={[EAdministration.DINUM]}
        title="Établissements de la collectivité"
      >
        <CollectiviteMap
          geoCommune={geoCommune}
          onMapReady={onMapLoad}
          onMapUnload={cleanupEtablissementsLayer}
        />
      </Section>
      <CollectiviteEconomieLocaleSection effectifs={effectifs} />
    </>
  );
}
