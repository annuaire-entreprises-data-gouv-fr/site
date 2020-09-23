import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../layouts';

interface IProps {
  response?: any;
  searchTerm?: string;
  lat?: string;
  lng?: string;
}

const About: React.FC<IProps> = ({ response, searchTerm, lat, lng }) => (
  <Page small={true} currentSearchTerm={searchTerm}>
    {response && (
      <div className="content-container">
        {response.total_results ? (
          <div className="results-counter">
            {response.total_results} résultats trouvés pour “<b>{searchTerm}</b>
            ”. {Math.min(response.total_results, 100)} résultats affichés.
          </div>
        ) : (
          <div className="results-counter">
            Aucune société n’a été trouvée pour “<b>{searchTerm}</b>”
            <p>
              Nous vous suggérons de vérifier l’orthographe du nom, du SIRET, ou
              de l'adresse que vous avez utilisé.
            </p>
          </div>
        )}
      </div>
    )}
    <div id="map"></div>
    {lat && lng && (
      <script
        dangerouslySetInnerHTML={{
          __html: `
                function initMap(style) {
                  if (!mapboxgl) {return;}

                  var map = new mapboxgl.Map({
                    container: 'map',
                    style: style, // stylesheet location
                    center: [${lng},${lat}], // starting position [lng, lat]
                    zoom: 12 // starting zoom
                  });
                  new mapboxgl.Marker({ color: '#000091' })
                  .setLngLat([${lng},${lat}])
                  .addTo(map);
                }

                fetch("https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json").then(res=> res.json()).then(el => initMap(el))
              `,
        }}
      />
    )}
    {response && (
      <script
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
                  var etablissements = ${JSON.stringify(
                    response.etablissement
                  )};
                  for (var i = 0; i < etablissements.length; i++) {
                      var etablissement = etablissements[i];
                      new mapboxgl.Marker({ color: '#000091' })
                      .setLngLat([etablissement.longitude,etablissement.latitude])
                      .addTo(map);
                  }
                }

                fetch("https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json").then(res=> res.json()).then(el => initMap(el))
              `,
        }}
      />
    )}

    <style jsx>{`
      .results-counter {
        margin-top: 10px;
        margin-bottom: 10px;
        color: rgb(112, 117, 122);
      }
      .title {
        color: #000091;
        text-decoration: none;
        font-size: 1.4rem;
        margin-bottom: 5px;
      }
      #map {
        width: 100%;
        min-height: 500px;
        flex-grow: 1;
      }
    `}</style>
  </Page>
);

const parsePage = (pageAsString: string) => {
  try {
    return parseInt(pageAsString, 10);
  } catch {
    return 1;
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { terme, lat, lng } = context.query;
  if (lat && lng) {
    return {
      props: {
        lat,
        lng,
      },
    };
  }

  if (terme) {
    //@ts-ignore
    const searchTerm = context.query.terme
      //@ts-ignore
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const request = await fetch(
      `https://entreprise.data.gouv.fr/api/sirene/v1/full_text/${encodeURI(
        //@ts-ignore
        searchTerm
        //@ts-ignore
      )}?per_page=100`
    );

    const response = await request.json();

    return {
      props: {
        response: response,
        searchTerm,
      },
    };
  }

  return {
    props: {
      response: null,
      searchTerm: null,
    },
  };
};

export default About;
