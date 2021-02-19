import React from 'react';
import MapboxInstance from '.';
import { Etablissement } from '../../models';

const MapEtablissement: React.FC<{ etablissement: Etablissement }> = ({
  etablissement,
}) => (
  <>
    <MapboxInstance />
    <script
      async
      defer
      dangerouslySetInnerHTML={{
        __html: `
                function initMap(style) {
                  if (!mapboxgl) {return;}

                  var coords = ${
                    etablissement
                      ? `[${etablissement.longitude},${etablissement.latitude}]`
                      : '[0.68484,47.394144]'
                  };

                  var zoom = ${etablissement ? '12' : '4.5'};

                  var map = new mapboxgl.Map({
                    container: 'map',
                    style: style, // stylesheet location
                    center: coords,
                    zoom: zoom // starting zoom
                  });
                  ${
                    etablissement
                      ? `new mapboxgl.Marker({ color: '#000091' })
                    .setLngLat(coords)
                    .addTo(map);`
                      : ''
                  }
                }

                fetch("https://etalab-tiles.fr/styles/osm-bright/style.json").then(res=> res.json()).then(el => initMap(el))
              `,
      }}
    />
  </>
);

export default MapEtablissement;
