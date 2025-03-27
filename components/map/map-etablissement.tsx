'use client';

import constants from '#models/constants';
import { IEtablissement } from '#models/core/types';
import maplibregl, { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';
import { checkLatLng } from './check-lat-lng';
import { hasWebGLSupport } from './has-web-gl';
import './map.css';

export function MapEtablissement({
  etablissement,
}: {
  etablissement: IEtablissement;
}) {
  // if (!etablissement.latitude || !etablissement.longitude) {
  //   const { lat, long } = await getGeoLoc(etablissement);
  //   etablissement.latitude = lat;
  //   etablissement.longitude = long;
  // }

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  const coords = checkLatLng(etablissement.latitude, etablissement.longitude);

  useEffect(() => {
    if (map.current || !coords) return; // stops map from intializing more than once
    if (!hasWebGLSupport()) {
      alert(
        'Votre navigateur ne supporte pas WebGL et WebGL est indispensable au chargement de la carte.'
      );
      return;
    }

    const zoom = etablissement ? 12 : 4.5;

    map.current = new maplibregl.Map({
      //@ts-ignore
      container: mapContainer.current,
      style: `https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json`,
      center: coords,
      zoom,
      minZoom: 3,
      attributionControl: {
        compact: true,
      },
    });

    const popup = new maplibregl.Popup({ offset: 30 }).setHTML(
      `<div>📍${etablissement.adresse}</div>`
    );

    new maplibregl.Marker({ color: constants.colors.frBlue })
      .setLngLat(coords)
      .setPopup(popup)
      .addTo(map.current);
  }, [etablissement, coords]);

  return (
    <>
      {coords ? (
        <div
          ref={mapContainer}
          className="map"
          style={{
            width: '100%',
            zIndex: '0',
            height: '200px',
            backgroundColor: '#f0f0f0',
          }}
        />
      ) : (
        <i>
          Nous n’avons pas réussi à déterminer la géolocalisation de cet
          établissement, car ses coordonnées sont invalides ou inconnues : [
          {etablissement.latitude || '⎽'}°, {etablissement.longitude || '⎽'}°].
        </i>
      )}
    </>
  );
}

export default MapEtablissement;
