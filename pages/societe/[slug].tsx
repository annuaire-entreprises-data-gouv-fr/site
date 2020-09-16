import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import ButtonLink from '../../components/button';

interface ISectionProps {
  title: string;
  width?: number;
  id?: string;
}

const Section: React.FC<ISectionProps> = ({
  id,
  children,
  title,
  width = 100,
}) => (
  <>
    <div className="section-container" id={id}>
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
  etablissement: any;
  uniteLegale: any;
}

const About: React.FC<IProps> = ({ etablissement, uniteLegale }) => (
  <Page small={true} useMapbox={true}>
    <div className="content-container">
      <div className="header-section">
        <h1>Société {etablissement.unite_legale.denomination}</h1>
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
        La société DENOMINATION est une TYPE_DE_STRUCTURE créee le ADRESSE .
        Elle est domiciliée à <a href="#contact">BLA</a> et elle est{' '}
        <b>
          {etablissement.etat_administratif === 'A' ? ' en activité' : 'fermée'}
          .
        </b>
      </p>
      <p>
        {etablissement.etablissement_siege === 'true'
          ? 'Cette société est le siège social de l’entreprise.'
          : 'Cette société est un établissement secondaire de l’entreprise.'}
        {uniteLegale.etablissements && (
          <>
            {' '}
            Celle-ci possède{' '}
            <a href="#etablissements">
              {uniteLegale.etablissements.length} établissements.
            </a>
          </>
        )}
      </p>
      <Section
        title={`Les informations sur cet établissement${
          etablissement.etablissement_siege === 'true' ? ' (siège social)' : ''
        }`}
      >
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
              <td>{etablissement.siret}</td>
            </tr>
            <tr>
              <th scope="row">SIREN</th>
              <td>{etablissement.siren}</td>
            </tr>
            <tr>
              <th scope="row">Clef NIC</th>
              <td>{etablissement.nic}</td>
            </tr>
            <tr>
              <th scope="row">Activité principale Etablissement</th>
              <td>{etablissement.activite_principale}</td>
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
      <div className="section-wrapper" id="contact">
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
                <td>{etablissement.geo_l4}</td>
              </tr>
              <tr>
                <th scope="row">Ville</th>
                <td>{etablissement.libelle_commune}</td>
              </tr>
              <tr>
                <th scope="row">Cedex</th>
                <td>{etablissement.code_postal}</td>
              </tr>
              <tr>
                <th scope="row">Date de création</th>
                <td>
                  {new Intl.DateTimeFormat('fr-FR').format(
                    new Date(etablissement.date_creation)
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
                  if (typeof maboxgl ==='undefined') {return;}

                  var map = new mapboxgl.Map({
                    container: 'map',
                    style: style, // stylesheet location
                    center: [${etablissement.longitude}, ${etablissement.latitude}], // starting position [lng, lat]
                    zoom: 14 // starting zoom
                  });
                  new mapboxgl.Marker({ color: '#000091' })
                  .setLngLat([${etablissement.longitude}, ${etablissement.latitude}])
                  .addTo(map);
                }

                fetch("https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json").then(res=> res.json()).then(el => initMap(el))
              `,
            }}
          />
        </div>
      </div>
      <Section
        title="La liste des établissements de l'entreprise"
        id="etablissements"
      >
        <table className="etablissement">
          <thead>
            <tr>
              <th>SIRET</th>
              <th>Clef NIC</th>
              <th scope="col">Adresse</th>
              <th scope="col">Statut</th>
            </tr>
          </thead>
          <tbody>
            {uniteLegale.etablissements.map((etablissementSecondaire: any) => (
              <tr>
                <td>{etablissementSecondaire.siret}</td>
                <td>{etablissementSecondaire.nic}</td>
                <td>{etablissementSecondaire.geo_adresse}</td>
                <td>
                  {' '}
                  {etablissementSecondaire.etablissement_siege === 'true' ? (
                    <span className="tags">siège social</span>
                  ) : null}
                  {etablissementSecondaire.etat_administratif === 'A' ? null : (
                    <span className="tags closed">fermé</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
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
      tr > td,
      table.etablissement th {
        padding-left: 30px;
      }
      table.etablissement {
        width:100%;:
      }
      table.etablissement tr:hover > td {
        background-color: #dfdff166;
        cursor: pointer;
      }
      table:not(.etablissement) th {
        padding-right: 30px;
        border-right: 1px solid #dfdff1;
      }
      table:not(.etablissement) > thead {
        display: none;
        background-color: #dfdff1;
      }

      .tags {
        font-size: 0.9rem;
        font-weight: bold;
        display: inline-block;
        background-color: #eee;
        color: #888;
        border-radius: 3px;
        padding: 0 5px;
        margin: 0;
        margin-right:10px;
      }

      .tags.closed {
        color:#914141;
        background-color:#ffe5e5;
      }
    `}</style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const siret = context.params.slug;

  console.time('Appel page entreprise');
  const etablissementRequest = await fetch(
    `https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/${encodeURI(
      //@ts-ignore
      siret
    )}`
  );
  const { etablissement } = await etablissementRequest.json();

  const uniteLegaleRequest = await fetch(
    `https://entreprise.data.gouv.fr/api/sirene/v3/unites_legales/${encodeURI(
      //@ts-ignore
      etablissement.siren
    )}`
  );
  const uniteLegale = await uniteLegaleRequest.json();
  console.timeEnd('Appel page entreprise');

  return {
    props: {
      etablissement: etablissement,
      uniteLegale: uniteLegale.unite_legale,
    },
  };
};

export default About;
