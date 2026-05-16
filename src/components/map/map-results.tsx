import maplibregl, { type Map as MapLibreMap } from "maplibre-gl";
import constants from "#/models/constants";
import type { ISearchResults } from "#/models/search";
import { formatIntFr, formatSiret } from "#/utils/helpers";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import { checkLatLng } from "./check-lat-lng";
import { hasWebGLSupport } from "./has-web-gl";
import "./map.css";

function MapWithResults({
  results,
  height,
  shouldColorZipCode,
}: {
  results: ISearchResults;
  height: string;
  shouldColorZipCode: boolean;
}) {
  const hasSupportedWebGl = hasWebGLSupport();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    if (!mapContainer.current) {
      return;
    }
    if (map.current) {
      return; // stops map from intializing more than once
    }

    if (!hasSupportedWebGl) {
      return;
    }

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style:
        "https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json",
      center: [2, 47],
      zoom: 4.5,
      minZoom: 3,
      attributionControl: {
        compact: true,
      },
    });
    const mapInstance = map.current;

    if (!mapInstance) {
      return;
    }

    results.results.forEach((result) => {
      const coordsSiege = checkLatLng(
        result.siege.latitude,
        result.siege.longitude
      );

      if (coordsSiege) {
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
          `<div><strong><a href="/entreprise/${result.chemin}">${formatIntFr(
            result.siren
          )}</a></strong><br/>${result.nomComplet}<br/>📍${
            result.siege.adresse
          }</div>`
        );

        new maplibregl.Marker({ color: constants.colors.frBlue })
          .setLngLat([
            Number.parseFloat(result.siege.longitude),
            Number.parseFloat(result.siege.latitude),
          ])
          .setPopup(popup)
          .addTo(mapInstance);
      }

      result.matchingEtablissements.forEach((match) => {
        if (match.estSiege) {
          return null;
        }

        const coordsEtab = checkLatLng(match.latitude, match.longitude);
        if (coordsEtab) {
          const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
            `<div><strong><a href="/etablissement/${match.siret}">${formatSiret(
              match.siret
            )}</a></strong><br/>Etablissement secondaire de <a href="/entreprise/${
              match.siren
            }">${result.nomComplet}</a><br/>📍${match.adresse}</div>`
          );

          new maplibregl.Marker({
            color: shouldColorZipCode ? "yellow" : constants.colors.pastelBlue,
          })
            .setLngLat([
              Number.parseFloat(match.longitude),
              Number.parseFloat(match.latitude),
            ])
            .setPopup(popup)
            .addTo(mapInstance);
        }
      });
    });
  }, [results, shouldColorZipCode, mapContainer, hasSupportedWebGl]);

  return (
    <div
      className="map"
      ref={mapContainer}
      style={{ width: "100%", zIndex: "0", height, backgroundColor: "#f0f0f0" }}
    >
      {!hasSupportedWebGl && (
        <i>
          Votre navigateur ne supporte pas WebGL, qui est indispensable à
          l’affichage de la carte.
        </i>
      )}
    </div>
  );
}

export default MapWithResults;
