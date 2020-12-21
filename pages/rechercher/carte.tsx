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
import PageCounter from '../../components/pageCounter';
import { removeInvisibleChar } from '../../model/routes';
import {
  redirectIfSiretOrSiren,
  redirectSiretIntrouvable,
} from '../../utils/redirect';

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
    noIndex={true}
    title="Rechercher une entreprise"
    canonical="https://annuaire-entreprises.data.gouv.fr/rechercher/carte"
  >
    <div className="map-container">
      <div id="map" />
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
                    Aucune entité n’a été trouvée pour “<b>{searchTerm}</b>”
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
            <ResultList resultList={response.unite_legale} />
          </div>
          <div className="results-footer">
            {response.total_pages && response.total_pages > 1 ? (
              <PageCounter
                totalPages={response.total_pages}
                currentPage={currentPage}
                searchTerm={searchTerm}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>

    <script src="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.js"></script>
    <link
      href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
      rel="stylesheet"
    />

    {response ? (
      <>
        <script
          async
          defer
          dangerouslySetInnerHTML={{
            __html: `
          function logSearch () {
            if(window.Piwik) {
              var tracker = window.Piwik.getTracker();
              if (tracker) {
                tracker.trackSiteSearch("${searchTerm}", "${'carte'}", ${
              response.total_results
            });
              }
            }
          }
          window.setTimeout(logSearch, 500);
          `,
          }}
        />
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
                    var uniteLegales = ${JSON.stringify(response.unite_legale)};
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
    ) : (
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
        height: calc(100vh - 140px);
      }
      .map-results {
        width: 550px;
        flex-shrink: 0;
        font-size: 1rem;
        height: 100%;
        overflow: auto;
      }
      .map-results > .results {
        padding: 0 10px;
        height: calc(100% - 60px);
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

      @media only screen and (min-width: 1px) and (max-width: 1100px) {
        .map-container {
          display: block;
          height: auto;
        }
        .map-results {
          width: 100%;
        }
        #map {
          background: #dfdff1;
          min-height: 30vh;
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
  const { terme = '', siret } = context.query;

  if (siret) {
    const etablissement = await getEtablissement(siret as string);
    if (!etablissement) {
      redirectSiretIntrouvable(context.res, siret as string);
    }
    return {
      props: {
        etablissement,
      },
    };
  }

  if (terme) {
    const searchTerm = terme as string;
    const escapedTerm = removeInvisibleChar(searchTerm);

    redirectIfSiretOrSiren(context.res, escapedTerm);

    //@ts-ignore
    const page = parsePage(context.query.page || '1') - 1;

    const results = await getResults(escapedTerm, page.toString());

    return {
      props: {
        response: results || {},
        searchTerm: searchTerm,
        currentPage: parsePage(results ? results.page : '0') + 1,
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
