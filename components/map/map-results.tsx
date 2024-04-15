'use client';

import maplibregl, { Map } from 'maplibre-gl';
import constants from '#models/constants';
import { ISearchResults } from '#models/search';
import { formatIntFr, formatSiret } from '#utils/helpers';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import './map.css';

export default function Map({
  results,
  height,
}: {
  results: ISearchResults;
  height: string;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map>(null);
  const [lng] = useState(2);
  const [lat] = useState(47);
  const [zoom] = useState(4.5);

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    //@ts-ignore
    map.current = new maplibregl.Map({
      //@ts-ignore
      container: mapContainer.current,
      style: `https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json`,
      center: [lng, lat],
      zoom: zoom,
      minZoom: 3,
    });

    results.results.forEach((result) => {
      var popup = new maplibregl.Popup({ offset: 25 }).setHTML(
        `<div><strong><a href="/entreprise/${result.chemin}">${formatIntFr(
          result.siren
        )}</a></strong><br/>${result.nomComplet}<br/>📍${
          result.siege.adresse
        }</div>`
      );

      new maplibregl.Marker({ color: constants.colors.frBlue })
        //@ts-ignore
        .setLngLat([result.siege.longitude, result.siege.latitude])
        .setPopup(popup)
        //@ts-ignore
        .addTo(map.current);

      result.matchingEtablissements.forEach((match) => {
        if (match.estSiege) {
          return null;
        }

        var popup = new maplibregl.Popup({ offset: 25 }).setHTML(
          `<div><strong><a href="/etablissement/${match.siret}">${formatSiret(
            match.siret
          )}</a></strong><br/>Etablissement secondaire de ${
            result.nomComplet
          }<br/>📍${match.adresse}</div>`
        );

        new maplibregl.Marker({ color: 'yellow' })
          //@ts-ignore
          .setLngLat([match.longitude, match.latitude])
          .setPopup(popup)
          //@ts-ignore
          .addTo(map.current);
      });
    });
  }, [lng, lat, zoom, results]);

  return (
    <div
      ref={mapContainer}
      className="map"
      style={{ width: '100%', zIndex: '0', height }}
    />
  );
}
