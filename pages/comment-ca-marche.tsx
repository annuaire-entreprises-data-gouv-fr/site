import React from 'react';

import Page from '../layouts';

const About: React.FC = () => {
  return (
    <Page small={true}>
      <div className="content-container">
        <h1>Comment ça marche ?</h1>
        <p>
          Ce site a été développé et est maintenu par{' '}
          <a href="https://etalab.gouv.fr">Etalab</a> et la{' '}
          <a href="https://entreprises.gouv.fr">
            Direction Générale des Entreprises (DGE)
          </a>
          .
          <br />
          Les données viennent des différentes administrations habilitées à les
          récolter et les traiter. Ce site ne fait que les aggréger et{' '}
          <b>ne les retraite pas</b>.
        </p>
        <div>
          <h2>D’où viennent les informations affichées sur le site ?</h2>
          <p>
            Toutes les informations affichées sur le site sont des informations
            publiques, accessibles librement et gratuitement. On appelle cela
            les données ouvertes ou l'open data.
          </p>
          <p>
            <b>NB :</b>Toutes les données ouvertes (open data) de
            l'administration sont accessibles sur
            <a href="https://data.gouv.fr">data.gouv.fr</a>
          </p>
          <h3>Les fiches entreprises et etablissements</h3>
          <p>
            Les informations comme le SIRET, l'adresse du siège social, la
            dénomination sont issues de la{' '}
            <a href="https://www.data.gouv.fr/fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/">
              base Sirene des entreprises
            </a>{' '}
            publiée par l'INSEE, et accessible à tous.
          </p>
          <h3>Les fiches d'immatriculation</h3>
          <p>
            Les informations de la fiche d’immatriculation sont issues du
            <a href="http://data.inpi.fr/">
              Registre National du Commerce et des Sociétés (RNCS)
            </a>{' '}
            ou du{' '}
            <a href="https://rnm.artisanat.fr/">
              Répertoire National des Métiers (RNM)
            </a>
            (dans le cas des entreprises artisanales).
          </p>
          <h2>Comment utiliser ces données dans mon site internet ?</h2>
          <p>
            Toutes les sources de données citées précédement sont accessibles
            grâce à des APIs :
          </p>
          <ul>
            <li>
              <a href="https://api.gouv.fr/guides/quelle-api-sirene">
                API Sirene données ouvertes
              </a>{' '}
              : qui donne accès à la base Sirene des entreprises de l'
              <a href="https://www.insee.fr/fr/accueil">INSEE</a>
            </li>
            <li>
              <a href="https://api-rnm.artisanat.fr/">
                API Répertoire National des Métiers
              </a>{' '}
              : les immatriculations d'entreprises artisanales, auprès de{' '}
              <a href="https://cma-france.fr/">CMA France</a>
            </li>
            <li>
              <a href="https://api.gouv.fr/les-api/api_inpi">
                API Registre National du Commerce et des Sociétés
              </a>{' '}
              : les immatriculations d'entreprises auprès des Greffes de
              tribunal de Commerce, centralisées par l’
              <a href="https://www.inpi.fr/fr">INPI</a>.
            </li>
          </ul>
          <p>
            <b>NB :</b>Toutes les APIs du service public sont référencées sur{' '}
            <a href="https://api.gouv.fr">api.gouv.fr</a>
          </p>
          <h2>
            Je suis une administration, comment utiliser ces données directement
            dans une démarche ou un back office ?
          </h2>
          <p>
            Il existe une API spéciale (nommée API Entreprise) réservée aux
            administrations et à certaines entreprises éligibles, qui permet
            d'accèder aux informations des entreprises détenue par
            l'administration :
          </p>
          <ul>
            <li>les informations d'immatriculation</li>
            <li>le chiffre d'affaire</li>
            <li>les certifications professionnelles</li>
            <li>... et bien d’autres</li>
          </ul>
          <p>
            <a href="https://api.gouv.fr/les-api/api-entreprise">
              ⇢ En savoir plus sur API Entreprise
            </a>
          </p>
        </div>
      </div>
    </Page>
  );
};

export default About;
