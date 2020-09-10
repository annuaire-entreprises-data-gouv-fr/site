import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import ButtonLink from '../../components/button';

interface ISectionProps {
  title: string;
  width?: number;
}

const Section: React.FC<ISectionProps> = ({ children, title, width = 100 }) => (
  <>
    <div className="section-container">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
    <style jsx>{`
      .section-container {
        border: 2px solid #dfdff1;
        border-radius: 2px;
        position: relative;
        margin: 40px 0 10px;
        padding: 1rem;
        padding-top: 2rem;
        width: ${width}%;
      }
      .section-container > h2 {
        position: absolute;
        top: -1.6rem;
        left: 20px;
        font-size: 1.1rem;
        line-height: 1.8rem;
        background-color: #dfdff1;
        color: #000091;
        padding: 0 7px;
        border-radius: 2px;
      }
    `}</style>
  </>
);

interface IProps {
  response: any;
  slug: string;
  currentPage?: number;
  maxPage: number;
}

const About: React.FC<IProps> = ({
  response,
  slug,
  currentPage = 1,
  maxPage,
}) => (
  <Page small={true}>
    {console.log(response)}
    <div className="content-container">
      <div className="header-section">
        <h1>Société {response.etablissement.unite_legale.denomination}</h1>
        <div className="cta">
          <ButtonLink href="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Justificatif d'immatriculation
          </ButtonLink>
        </div>
      </div>
      <p>
        Blabla bla on présente la société, son statut, ou ca depuis combien de
        temps, ancre vers l'adresse et le contact, si plusieurs etablissement,
        ancre vers la liste. Si etablissement secondaire, sinon lien vers le
        siège social de l'entreprise.
      </p>
      {response.etablissement.is_siege && (
        <p>Cette société est le siège social de l'entreprise</p>
      )}
      <Section title="Les informations sur cet établissement [en commentaire, siege sociale, etab secondaire]">
        <table>
          <thead>
            <tr>
              <th></th>
              <th scope="col">Informations générales</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">SIRET</th>
              <td>{response.etablissement.siret}</td>
            </tr>
            <tr>
              <th scope="row">SIREN</th>
              <td>{response.etablissement.siren}</td>
            </tr>
            <tr>
              <th scope="row">Clef NIC</th>
              <td>{response.etablissement.nic}</td>
            </tr>
            <tr>
              <th scope="row">Activité principale Etablissement</th>
              <td>{response.etablissement.activite_principale}</td>
            </tr>
            <tr>
              <th scope="row">Activité principale Entreprise</th>
              <td>/</td>
            </tr>
            <tr>
              <th scope="row">N° TVA Intracommunautaire</th>
              <td>18,000</td>
            </tr>
          </tbody>
        </table>
      </Section>
      <div className="section-wrapper">
        <Section title="Les informations de contact">
          <table>
            <thead>
              <tr>
                <th></th>
                <th scope="col">Informations de contact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Gérant</th>
                <td>Non renseigné</td>
              </tr>
              <tr>
                <th scope="row">Adresse</th>
                <td>{response.etablissement.geo_l4}</td>
              </tr>
              <tr>
                <th scope="row">Ville</th>
                <td>{response.etablissement.libelle_commune}</td>
              </tr>
              <tr>
                <th scope="row">Cedex</th>
                <td>{response.etablissement.code_postal}</td>
              </tr>
              <tr>
                <th scope="row">Date de création</th>
                <td>
                  {new Intl.DateTimeFormat('fr-FR').format(
                    new Date(response.etablissement.date_creation)
                  )}
                </td>
              </tr>
              <tr>
                <th scope="row">Tranche d’effectif salarié</th>
                <td>18,000</td>
              </tr>
            </tbody>
          </table>
        </Section>
        <div className="map">
          <div id="map" style={{ width: '100%', height: '100%' }}></div>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                function initMap(style) {
                  console.log(style)
                  var map = new mapboxgl.Map({
                    container: 'map',
                    style: style, // stylesheet location
                    center: [${response.etablissement.longitude}, ${response.etablissement.latitude}], // starting position [lng, lat]
                    zoom: 14 // starting zoom
                  });
                  new mapboxgl.Marker({ color: '#000091' })
                  .setLngLat([${response.etablissement.longitude}, ${response.etablissement.latitude}])
                  .addTo(map);
                }

                fetch("https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json").then(res=> res.json()).then(el => initMap(el))
              `,
            }}
          />
        </div>
      </div>
      <Section title="La liste des établissements de l'entreprise"></Section>
    </div>
    <style jsx>{`
      .header-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .content-container {
        margin: 20px auto 40px;
      }
      .section-wrapper {
        display: flex;
      }
      .section-wrapper .map {
        background-color: #dfdff1;
        width: 50%;
        max-width: 450px;
        flex-shrink: 0;
        margin: 40px 0 10px 20px;
      }

      table {
        border-collapse: collapse;
        text-align: left;
        color: #081d35;
      }

      tr td,
      th {
        border: 1px solid #dfdff1;
        border-left: none;
        border-right: none;
        border: none;
        padding: 5px;
        background-color: #fff;
      }
      tr > td {
        padding-left: 30px;
      }
      th {
        padding-right: 30px;
        border-right: 1px solid #dfdff1;
      }

      thead {
        display: none;
        background-color: #dfdff1;
      }
    `}</style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const slug = context.params.slug;

  // const request = await fetch(
  //   `https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/${encodeURI(
  //     //@ts-ignore
  //     slug
  //   )}`
  // );
  //const response = await request.json();

  return {
    props: {
      response: {},
      slug,
    },
  };
};

export default About;
