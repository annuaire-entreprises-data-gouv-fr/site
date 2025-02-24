'use client';

import constants from '#models/constants';
import { ISearchResults } from '#models/search';
import { formatIntFr, formatSiret } from '#utils/helpers';
import maplibregl, { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';
import { checkLatLng } from './check-lat-lng';
import './map.css';
import withWebGL from './with-web-gl';

function MapWithResults({
  results,
  height,
  shouldColorZipCode,
}: {
  results: ISearchResults;
  height: string;
  shouldColorZipCode: boolean;
}) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return; // stops map from intializing more than once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json`,
      center: [2, 47],
      zoom: 4.5,
      minZoom: 3,
      attributionControl: {
        compact: true,
      },
    });

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
            parseInt(result.siege.longitude),
            parseInt(result.siege.latitude),
          ])
          .setPopup(popup)
          .addTo(map.current!);
      }

      result.matchingEtablissements.forEach((match) => {
        if (match.estSiege) {
          return null;
        }

        const coordsEtab = checkLatLng(match.latitude, match.longitude);
        if (coordsEtab) {
          var popup = new maplibregl.Popup({ offset: 25 }).setHTML(
            `<div><strong><a href="/etablissement/${match.siret}">${formatSiret(
              match.siret
            )}</a></strong><br/>Etablissement secondaire de <a href="/entreprise/${
              match.siren
            }">${result.nomComplet}</a><br/>📍${match.adresse}</div>`
          );

          new maplibregl.Marker({
            color: shouldColorZipCode ? 'yellow' : constants.colors.pastelBlue,
          })
            .setLngLat([parseInt(match.longitude), parseInt(match.latitude)])
            .setPopup(popup)
            .addTo(map.current!);
        }
      });
    });
  }, [results, shouldColorZipCode, mapContainer]);

  return (
    <div
      ref={mapContainer}
      className="map"
      style={{ width: '100%', zIndex: '0', height }}
    />
  );
}

export default withWebGL(MapWithResults);
