import React from 'react';

import Page from '../layouts';

const ExtraitKbis: React.FC = () => {
  return (
    <Page small={true} title="Comment ça marche ?">
      <div className="content-container">
        <h1>À propos des données contenues dans une extrait KBIS</h1>
        <div>
          <h2>Comment accéder aux données d'un extrait KBIS via API ?</h2>
          <p>
            Toutes les informations affichées sur le site sont des informations
            publiques, accessibles librement et gratuitement. On appelle cela
            les données ouvertes ou l'open data.
          </p>
          <p>
            <b>NB :</b> toutes les données ouvertes (open data) de
            l'administration sont accessibles sur{' '}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://data.gouv.fr"
            >
              data.gouv.fr
            </a>
          </p>
          <h3>Les fiches entreprises et etablissements</h3>
          <p>
            Les informations comme le SIRET, l'adresse du siège social, la
            dénomination sont issues de la{' '}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://www.data.gouv.fr/fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/"
            >
              base Sirene des entreprises
            </a>{' '}
            publiée par l'INSEE, et accessible à tous.
          </p>
          <h3>Les fiches d'immatriculation</h3>
          <p>
            Les informations de la fiche d’immatriculation sont issues du{' '}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="http://data.inpi.fr/"
            >
              Registre National du Commerce et des Sociétés (RNCS)
            </a>{' '}
            ou du{' '}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://rnm.artisanat.fr/"
            >
              Répertoire National des Métiers (RNM)
            </a>{' '}
            (dans le cas des entreprises artisanales).
          </p>
          <h2>Comment utiliser ces données dans mon site internet ?</h2>
          <p>
            Toutes les sources de données citées précédement sont accessibles
            grâce à des APIs :
          </p>
          <ul>
            <li>
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://api.gouv.fr/guides/quelle-api-sirene"
              >
                API Sirene données ouvertes
              </a>{' '}
              : qui donne accès à la base Sirene des entreprises de l'
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://www.insee.fr/fr/accueil"
              >
                INSEE
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://api.gouv.fr/les-api/api_rnm"
              >
                API Répertoire National des Métiers
              </a>{' '}
              : les immatriculations d'entreprises artisanales, auprès de{' '}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://cma-france.fr/"
              >
                CMA France
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://api.gouv.fr/les-api/api_inpi"
              >
                API Registre National du Commerce et des Sociétés
              </a>{' '}
              : les immatriculations d'entreprises auprès des Greffes de
              tribunal de Commerce, centralisées par l’
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://www.inpi.fr/fr"
              >
                INPI
              </a>
              .
            </li>
            <li>
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://api.gouv.fr/les-api/api_rna"
              >
                API Répertoire National des Associations
              </a>{' '}
              : les informations des associations, centralisées par le{' '}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://www.interieur.gouv.fr"
              >
                Ministère de l’Intérieur
              </a>
            </li>
          </ul>
          <p>
            <b>NB :</b>Toutes les APIs du service public sont référencées sur{' '}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://api.gouv.fr"
            >
              api.gouv.fr
            </a>
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
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://api.gouv.fr/les-api/api-entreprise"
            >
              ⇢ En savoir plus sur API Entreprise
            </a>
          </p>
        </div>
      </div>
    </Page>
  );
};

export default ExtraitKbis;
