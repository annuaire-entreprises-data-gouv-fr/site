import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import {
  Etablissement,
  SearchResults,
  getEtablissement,
  getResults,
} from '../../model';
import ResultList from '../../components/resultList';
import { isSirenOrSiret } from '../../utils/helper';
import PageCounter from '../../components/pageCounter';
import { removeInvisibleChar } from '../../model/routes';
import redirect from '../../utils/redirect';

interface IProps {
  response?: SearchResults;
  searchTerm?: string;
  etablissement?: Etablissement;
  currentPage: number;
}

const About: React.FC<IProps> = ({
  response,
  searchTerm = '',
  etablissement,
  currentPage = 1,
}) => (
  <Page
    small={true}
    currentSearchTerm={searchTerm}
    map={true}
    title="Rechercher une entreprise"
  >
    <div className="map-container">
      <div id="map"></div>

      {response && response.unite_legale && (
        <div className="map-results">
          <div className="results">
            <div className="results-counter">
              {response ? (
                response.total_results ? (
                  <>
                    {response.total_results} résultats trouvés pour “
                    <b>{searchTerm}</b>
                    ”.{' '}
                    <a href={`/rechercher/?terme=${searchTerm}`}>
                      Afficher les résultats sous forme de liste
                    </a>
                  </>
                ) : (
                  <>
                    Aucune société n’a été trouvée pour “<b>{searchTerm}</b>”
                    <p>
                      Nous vous suggérons de vérifier l’orthographe du nom, du
                      SIRET, ou de l'adresse que vous avez utilisé.
                    </p>
                  </>
                )
              ) : (
                <>🏄🏻‍♂️</>
              )}
            </div>
            <ResultList resultList={response.unite_legale} compact={true} />
          </div>
          <div className="results-footer">
            {response.total_pages && response.total_pages > 1 && (
              <PageCounter
                totalPages={response.total_pages}
                currentPage={currentPage}
                searchTerm={searchTerm}
              />
            )}
          </div>
        </div>
      )}
    </div>

    {response ? (
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
                  var uniteLegales = ${JSON.stringify(response.unite_legale)};
                  for (var i = 0; i < uniteLegales.length; i++) {
                      var uniteLegale = uniteLegales[i];
                      new mapboxgl.Marker({ color: '#000091' })
                      .setLngLat([uniteLegale.longitude,uniteLegale.latitude])
                      .addTo(map);
                  }
                }

                fetch("https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json").then(res=> res.json()).then(el => initMap(el))
              `,
        }}
      />
    ) : (
      <script
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
        margin-bottom: 15px;
      }
      .title {
        color: #000091;
        text-decoration: none;
        font-size: 1.4rem;
        margin-bottom: 5px;
      }
      .map-container {
        display: flex;
        flex-direction: row-reverse;
        height: calc(100vh - 120px);
      }
      .map-results {
        width: 600px;
        font-size: 1rem;
        height: 100%;
        overflow: auto;
      }
      .map-results > .results {
        padding: 0 10px;
        height: calc(100% - 50px);
        overflow: auto;
      }
      .map-results > .results-footer {
        height: 50px;
        width: 100%;
        display: flex;
        border-top: 1px solid #dfdff1;
      }
      #map {
        background: #dfdff1;
        width: 100%;
      }

      @media only screen and (min-width: 1px) and (max-width: 900px) {
        .map-container {
          display: block;
          height: auto;
        }
        .map-results {
          width: 100%;
        }
        #map {
          background: #dfdff1;
          min-height: 250px;
        }
        .map-results > .results {
          height: auto;
          overflow: none;
        }
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
    const searchTerm = terme as string;
    const escapedTerm = removeInvisibleChar(searchTerm);

    if (isSirenOrSiret(escapedTerm)) {
      redirect(context.res, `/entreprise/${escapedTerm}`);
    }

    const results = await getResults(
      escapedTerm,
      (context.query.page || '') as string
    );

    return {
      props: {
        response: results || {},
        searchTerm: searchTerm,
        currentPage: parsePage(results ? results.page : '1'),
      },
    };
  }

  return {
    props: {
      response: null,
      etablissement: null,
      searchTerm: null,
    },
  };
};

export default About;
