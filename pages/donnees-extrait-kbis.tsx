import React from 'react';

import Page from '../layouts';

const ExtraitKbis: React.FC = () => {
  return (
    <Page small={true} title="Comment ça marche ?">
      <div className="content-container">
        <h1>À propos des données contenues dans un extrait KBIS</h1>
        <div>
          <h2>
            Comment accéder aux données d'un extrait KBIS via le site
            annuaire-entreprises.data.gouv.fr
          </h2>
          <p>
            Pour retrouver les informations d'immatriculation d'une entreprise,{' '}
            <a href="/rechercher">utilisez le moteur de recherche</a> pour
            trouver la page de l'entreprise concernée.
            <br />
            Une fois sur la page de l'entreprise, consultez l'onglet
            justificatif, pour y retrouver les données d'immatriculations, soit
            au Registre National du Commerce et des Sociétés (RNCS), soit au
            Répertoire National des Métiers (RNM).
          </p>
          <h2>Comment accéder aux données d'un extrait KBIS via une API</h2>
          <p>
            Toutes les sources de données affichées sur le site sont accessibles
            grâce à des API. Pour en savoir plus :
          </p>
          <ul>
            <li>
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://api.gouv.fr/guides/quelle-api-sirene"
              >
                API Sirene
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
          <h2>Accéder à des données complémentaires sur les entreprises</h2>
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
