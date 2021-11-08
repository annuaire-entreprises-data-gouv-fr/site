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
            var uniteLegales = ${JSON.stringify(results)};
            for (var i = 0; i < uniteLegales.length; i++) {
                var uniteLegale = uniteLegales[i];

                var popup = new maplibregl.Popup({ offset: 25 }).setHTML(
                '<div><b>'+uniteLegale.nomComplet+'</b></div>'+
                '<div><i>'+uniteLegale.adresse+'</i></div>'+
                '<div><a href="/entreprise/'+uniteLegale.siren+'">⇢ Accéder à la fiche entreprise</a></div>'
                );

                new maplibregl.Marker({ color: '#000091' })
                .setLngLat([uniteLegale.longitude,uniteLegale.latitude])
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
