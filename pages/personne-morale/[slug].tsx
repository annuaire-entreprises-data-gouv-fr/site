import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';

const About: React.FC = ({ response, slug, currentPage = 1, maxPage }) => (
  <Page small={true}>
    <div className="content-container">
      <h1>Société {response.etablissement.unite_legale.denomination}</h1>
      <div>
        Blabla bla on présente la société, son statut, ou ca depuis combien de
        temps, lien rapide vers l'adresse. Et peut-etre a droite on garde la
        carte mais pas certain que cela soit la meilleure idée
      </div>
      <div className="informations">
        <h2>Les informations sur la société</h2>
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
              <td>3,000</td>
            </tr>
            <tr>
              <th scope="row">SIREN</th>
              <td>18,000</td>
            </tr>
            <tr>
              <th scope="row">Clef NIC</th>
              <td>18,000</td>
            </tr>
            <tr>
              <th scope="row">Activité principale Etablissement</th>
              <td>18,000</td>
            </tr>
            <tr>
              <th scope="row">Activité principale Entreprise</th>
              <td>18,000</td>
            </tr>
            <tr>
              <th scope="row">Numéro RNA</th>
              <td>18,000</td>
            </tr>
            <tr>
              <th scope="row">N° TVA Intracommunautaire</th>
              <td>18,000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <h2>Les informations de contact</h2>
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
              <td>3,000</td>
            </tr>
            <tr>
              <th scope="row">Adresse</th>
              <td>18,000</td>
            </tr>
            <tr>
              <th scope="row">Ville</th>
              <td>18,000</td>
            </tr>
            <tr>
              <th scope="row">Cedex</th>
              <td>18,000</td>
            </tr>
            <tr>
              <th scope="row">Date de création</th>
              <td>18,000</td>
            </tr>
            <tr>
              <th scope="row">Tranche d’effectif salarié</th>
              <td>18,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    {JSON.stringify(response)}
    <style jsx>{`
      .informations > table {
        width: 48%;
      }

      table {
        border-collapse: collapse;
        text-align: left;
        color: #081d35;
      }

      tr td,
      th {
        padding: 5px;
        border: 1px solid #00009155;
        padding: 5px 8px;
        background-color: #fff;
      }

      thead,
      th {
        background-color: #ebf6ff;
      }
    `}</style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const slug = context.params.slug;

  const request = await fetch(
    `https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/${encodeURI(
      slug
    )}`
  );

  const response = await request.json();
  return {
    props: {
      response,
      slug,
    },
  };
};

export default About;
