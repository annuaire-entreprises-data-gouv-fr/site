'use client';

import constants from '#models/constants';
import { IEtablissement } from '#models/core/types';
import { hasAnyError, isDataLoading } from '#models/data-fetching';
import { useFetchGeoLoc } from 'hooks/fetch/geoloc';
import maplibregl, { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';
import { hasWebGLSupport } from './has-web-gl';
import './map.css';

export function MapEtablissement({
  etablissement,
}: {
  etablissement: IEtablissement;
}) {
  const coords = useFetchGeoLoc(etablissement);

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (isDataLoading(coords)) {
      return; // still loading
    }
    if (hasAnyError(coords)) {
      return; // should not be displayed
    }
    if (map.current || !coords) {
      return; // stops map from intializing more than once
    }
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
      attributionControl: { compact: true },
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
    <div
      ref={mapContainer}
      className="map layout-center"
      style={{
        width: '100%',
        zIndex: '0',
        height: '100%',
        minHeight: '150px',
        borderRadius: '8px',
        backgroundColor: '#f0f0f0',
        textAlign: 'center',
      }}
    >
      {(!coords || hasAnyError(coords)) && (
        <i>
          Impossible d’afficher la carte.
          <br />
          Cela peut-être dû à un problème d’affichage, ou à un problème dans les
          coordonnées de l’établissement.
          <br />
          (coordonnées [{etablissement?.latitude || '⎽'}°,{' '}
          {etablissement?.longitude || '⎽'}
          °])
        </i>
      )}
    </div>
  );
}

export default MapEtablissement;
