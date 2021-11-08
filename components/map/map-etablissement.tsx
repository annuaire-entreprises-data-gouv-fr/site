import React from 'react';
import MaplibreInstance from '.';
import { IEtablissement } from '../../models';

const MapEtablissement: React.FC<{ etablissement: IEtablissement }> = ({
  etablissement,
}) => (
  <>
    <MaplibreInstance />
    <script
      async
      defer
      dangerouslySetInnerHTML={{
        __html: `
                function initMap(style) {
                  if (maplibregl === undefined) {return;}

                  var coords = ${
                    etablissement
                      ? `[${etablissement.longitude},${etablissement.latitude}]`
                      : '[0.68484,47.394144]'
                  };

                  var zoom = ${etablissement ? '12' : '4.5'};

                  var map = new maplibregl.Map({
                    container: 'map',
                    style: style, // stylesheet location
                    center: coords,
                    zoom: zoom // starting zoom
                  });
                  ${
                    etablissement
                      ? `new maplibregl.Marker({ color: '#000091' })
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
