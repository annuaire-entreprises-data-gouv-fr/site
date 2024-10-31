/* eslint-disable import/order */
'use client';

import constants from '#models/constants';
import { IEtablissement } from '#models/core/types';
import { formatSiret } from '#utils/helpers';
import maplibregl, { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';
import { checkLatLng } from './check-lat-lng';
import './map.css';

export function MapEtablissements({
  etablissements,
}: {
  etablissements: IEtablissement[];
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map>(null);

  const coords = (e: IEtablissement) => checkLatLng(e.latitude, e.longitude);

  useEffect(() => {
    if (map.current || !coords) return; // stops map from intializing more than once

    // const zoom = etablissement ? 12 : 4.5;

    //@ts-ignore
    map.current = new maplibregl.Map({
      //@ts-ignore
      container: mapContainer.current,
      style: `https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json`,
      center: [2, 47],
      zoom: 4.5,
      minZoom: 3,
      attributionControl: {
        compact: true,
      },
    });

    etablissements.forEach((etablissement: IEtablissement) => {
      const coordsSiege = checkLatLng(
        etablissement.latitude,
        etablissement.longitude
      );

      if (coordsSiege) {
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
          `<div><strong><a href="/etablissement/${
            etablissement.siret
          }">${formatSiret(etablissement.siret)}${
            etablissement.estSiege ? ` (siège social)` : ''
          }</a></strong><br/>📍${etablissement.adresse}</div>`
        );

        new maplibregl.Marker({
          color: etablissement.estSiege
            ? constants.colors.frBlue
            : constants.colors.pastelBlue,
        })
          //@ts-ignore
          .setLngLat([etablissement.longitude, etablissement.latitude])
          .setPopup(popup)
          //@ts-ignore
          .addTo(map.current);
      }
    });
  }, [etablissements]);

  return (
    <div
      ref={mapContainer}
      className="map"
      style={{ width: '100%', zIndex: '0', height: '80vh' }}
    />
  );
}

export default MapEtablissements;
