/* eslint-disable import/order */
'use client';

import constants from '#models/constants';
import { IEtablissement } from '#models/core/types';
import { formatSiret } from '#utils/helpers';
import maplibregl, { LngLatLike, Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';
import './map.css';

function checkLatLng(latitude: string, longitude: string): LngLatLike | null {
  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (
      isNaN(lat) ||
      isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      throw new Error('Invalid coords');
    }

    return {
      lat,
      lng,
    };
  } catch {}
  return null;
}

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
