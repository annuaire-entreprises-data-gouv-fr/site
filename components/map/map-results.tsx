import React from 'react';
import MaplibreInstance from '.';
import { ISearchResult } from '../../models/search';

const MapResults: React.FC<{ results: ISearchResult[] }> = ({ results }) => (
  <>
    <MaplibreInstance />
    <script
      async
      defer
      dangerouslySetInnerHTML={{
        __html: `
          function initMap(style) {
            var map = new maplibregl.Map({
              container: 'map',
              style: style, // stylesheet location
              center: [2, 46], // starting position [lng, lat]
              zoom: 4.5 // starting zoom
            });
            var results = ${JSON.stringify(results)};
            for (var i = 0; i < results.length; i++) {
                var result = results[i];

                var popup = new maplibregl.Popup({ offset: 25 }).setHTML(
                '<div><b>'+result.nomComplet+'</b></div>'+
                '<div><i>'+result.adresse+'</i></div>'+
                '<div><a href="/entreprise/'+result.siren+'">⇢ Accéder à la fiche entreprise</a></div>'
                );

                new maplibregl.Marker({ color: '#000091' })
                .setLngLat([result.longitude,result.latitude])
                .setPopup(popup)
                .addTo(map);
            }
          }


          fetch("https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json").then(res=> res.json()).then(el => initMap(el))
        `,
      }}
    />
  </>
);

export default MapResults;
