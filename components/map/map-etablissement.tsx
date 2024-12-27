'use client';

import constants from '#models/constants';
import { estActif } from '#models/core/etat-administratif';
import { IEtablissement } from '#models/core/types';
import { formatSiret } from '#utils/helpers';
import maplibregl, { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import { checkLatLng } from './check-lat-lng';
import './map.css';

export const EtablissementsMap = ({
  filteredEtablissements,
  selectedEtablissement,
}: {
  filteredEtablissements: IEtablissement[];
  selectedEtablissement: IEtablissement | null;
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  const [exceptions, setExceptions] = useState<IEtablissement[]>([]);

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    const zoom = selectedEtablissement ? 12 : 4.5;
    const center = selectedEtablissement
      ? checkLatLng(
          selectedEtablissement.latitude,
          selectedEtablissement.longitude
        ) || [2, 47]
      : [2, 47];

    map.current = new maplibregl.Map({
      //@ts-ignore
      container: mapContainer.current,
      style: `https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json`,
      center,
      zoom,
      minZoom: 3,
      attributionControl: {
        compact: true,
      },
    });

    filteredEtablissements.forEach((etablissement) => {
      const coords = checkLatLng(
        etablissement.latitude,
        etablissement.longitude
      );

      if (!coords) {
        setExceptions([...exceptions, etablissement]);
        return;
      }

      const popup = new maplibregl.Popup({ offset: 30 }).setHTML(
        `<div><strong>${formatSiret(etablissement.siret)}</strong><br/>📍${
          etablissement.adresse
        }</div>`
      );

      const markerColor = !estActif(etablissement)
        ? 'red'
        : etablissement.estSiege
        ? constants.colors.pastelBlue
        : constants.colors.frBlue;

      new maplibregl.Marker({ color: markerColor })
        .setLngLat(coords)
        .setPopup(popup)
        .addTo(map.current);
    });
  }, [filteredEtablissements]);
  return (
    <div
      style={{
        padding: '20px 0',
      }}
    >
      {exceptions.map((e) => (
        <i>
          Nous n’avons pas réussi à déterminer la géolocalisation de cet
          établissement, car ses coordonnées sont invalides ou inconnues : [
          {e.latitude || '⎽'}°, {e.longitude || '⎽'}°].
        </i>
      ))}
      <div
        ref={mapContainer}
        className="map"
        style={{ width: '100%', zIndex: '0', height: '450px' }}
      />
    </div>
  );
};
