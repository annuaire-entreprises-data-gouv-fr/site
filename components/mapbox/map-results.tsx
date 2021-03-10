import React from 'react';
import MapboxInstance from '.';
import { ISearchResult } from '../../models/search';

const MapResults: React.FC<{ results: ISearchResult[] }> = ({ results }) => (
  <>
    <MapboxInstance />
    <script
      async
      defer
      dangerouslySetInnerHTML={{
        __html: `
                  function initMap(style) {
                    if (!mapboxgl) {return;}

                    var map = new mapboxgl.Map({
                      container: 'map',
                      style: style, // stylesheet location
                      center: [2, 46], // starting position [lng, lat]
                      zoom: 4.5 // starting zoom
                    });
                    var uniteLegales = ${JSON.stringify(results)};
                    for (var i = 0; i < uniteLegales.length; i++) {
                        var uniteLegale = uniteLegales[i];

                        var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                        '<div><b>'+uniteLegale.nom_complet+'</b></div>'+
                        '<div><i>'+uniteLegale.geo_adresse+'</i></div>'+
                        '<div><a href="/entreprise/'+uniteLegale.siren+'">⇢ Accéder a la fiche entreprise</a></div>'
                        );

                        new mapboxgl.Marker({ color: '#000091' })
                        .setLngLat([uniteLegale.longitude,uniteLegale.latitude])
                        .setPopup(popup)
                        .addTo(map);
                    }
                  }


                  fetch("https://etalab-tiles.fr/styles/osm-bright/style.json").then(res=> res.json()).then(el => initMap(el))
                `,
      }}
    />
  </>
);

export default MapResults;
