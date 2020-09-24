import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../layouts';
import {
  Etablissement,
  SearchResults,
  getEtablissement,
  getResults,
} from '../model';

interface IProps {
  response?: SearchResults;
  searchTerm?: string;
  etablissement?: Etablissement;
}

const About: React.FC<IProps> = ({ response, searchTerm, etablissement }) => (
  <Page small={true} currentSearchTerm={searchTerm}>
    <div className="content-container results-counter">
      {response ? (
        response.total_results ? (
          <>
            {response.total_results} résultats trouvés pour “<b>{searchTerm}</b>
            ”. {Math.min(response.total_results, 100)} résultats affichés.
          </>
        ) : (
          <>
            Aucune société n’a été trouvée pour “<b>{searchTerm}</b>”
            <p>
              Nous vous suggérons de vérifier l’orthographe du nom, du SIRET, ou
              de l'adresse que vous avez utilisé.
            </p>
          </>
        )
      ) : (
        <>🏄🏻‍♂️</>
      )}
    </div>
    <div id="map"></div>

    {etablissement && (
      <script
        dangerouslySetInnerHTML={{
          __html: `
                function initMap(style) {
                  if (!mapboxgl) {return;}

                  var map = new mapboxgl.Map({
                    container: 'map',
                    style: style, // stylesheet location
                    center: [${etablissement.longitude},${etablissement.latitude}], // starting position [lng, lat]
                    zoom: 12 // starting zoom
                  });
                  new mapboxgl.Marker({ color: '#000091' })
                  .setLngLat([${etablissement.longitude},${etablissement.latitude}])
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
        height: 24px;
      }
      .title {
        color: #000091;
        text-decoration: none;
        font-size: 1.4rem;
        margin-bottom: 5px;
      }
      #map {
        width: 100%;
        height: calc(100vh - 164px);
        background-color: red;
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
  const { terme, siret } = context.query;
  if (siret) {
    const etablissement = await getEtablissement(siret as string);
    return {
      props: {
        etablissement,
      },
    };
  }

  if (terme) {
    const results = await getResults(terme as string, '1');

    return {
      props: {
        response: results,
        searchTerm: terme as string,
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
