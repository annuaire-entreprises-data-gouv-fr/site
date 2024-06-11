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

export function MapEtablissement({
  etablissement,
}: {
  etablissement: IEtablissement;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map>(null);

  const coords = checkLatLng(etablissement.latitude, etablissement.longitude);

  useEffect(() => {
    if (map.current || !coords) return; // stops map from intializing more than once

    const zoom = etablissement ? 12 : 4.5;

    //@ts-ignore
    map.current = new maplibregl.Map({
      //@ts-ignore
      container: mapContainer.current,
      style: `https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json`,
      center: coords,
      zoom,
      minZoom: 3,
      attributionControl: {
        compact: true,
        customAttribution:
          '<a href="https://www.openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© Contributeurs OpenStreetMap</a>',
      },
    });

    const popup = new maplibregl.Popup({ offset: 30 }).setHTML(
      `<div><strong>${formatSiret(etablissement.siret)}</strong><br/>📍${
        etablissement.adresse
      }</div>`
    );

    new maplibregl.Marker({ color: constants.colors.frBlue })
      //@ts-ignore
      .setLngLat(coords)
      .setPopup(popup)
      //@ts-ignore
      .addTo(map.current);
  }, [etablissement, coords]);

  return (
    <div
      style={{
        padding: '20px 0',
      }}
    >
      {coords ? (
        <div
          ref={mapContainer}
          className="map"
          style={{ width: '100%', zIndex: '0', height: '450px' }}
        />
      ) : (
        <i>
          Nous n’avons pas réussi à déterminer la géolocalisation de cet
          établissement, car ses coordonnées sont invalides ou inconnues : [
          {etablissement.latitude || '⎽'}°, {etablissement.longitude || '⎽'}°].
        </i>
      )}
    </div>
  );
}

export default MapEtablissement;
