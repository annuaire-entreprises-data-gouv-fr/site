import React from 'react';
import TextWrapper from '#components-ui/text-wrapper';
import { INSEE } from '#components/administrations';
import Meta from '#components/meta';
import { NextPageWithLayout } from './_app';

const About: NextPageWithLayout = () => {
  return (
    <>
      <Meta title="Comment ça marche ?" />
      <TextWrapper>
        <h1>À propos de L’Annuaire des Entreprises</h1>
        <h2>Qui a développé ce site ?</h2>
        <p>
          Ce site a été développé et est maintenu par{' '}
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://etalab.gouv.fr"
          >
            Etalab
          </a>{' '}
          et la{' '}
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://entreprises.gouv.fr"
          >
            Direction Générale des Entreprises (DGE)
          </a>
          .
          <br />
          Les données viennent des différentes administrations habilitées à les
          récolter et les traiter. Ce site ne fait que centraliser les données.
          <b>Il ne les modifie pas et ne les stocke pas</b>.
        </p>
        <div>
          <h2>D’où viennent les informations affichées sur le site ?</h2>
          <p>
            Toutes les informations affichées sur le site sont des informations
            publiques, accessibles librement et gratuitement. On appelle cela
            les données ouvertes ou l’open data.
          </p>
          <p>
            <b>NB :</b> toutes les données ouvertes (open data) de
            l’administration sont accessibles sur{' '}
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
            Les informations comme le SIRET, l’adresse du siège social, la
            dénomination sont issues de la{' '}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://www.data.gouv.fr/fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/"
            >
              base Sirene des entreprises
            </a>{' '}
            publiée par l’
            <INSEE />, et accessible à tous.
          </p>
          <h3>Les fiches d’immatriculation</h3>
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
          <h2>
            Utilisation du site dans le cadre de démarches administratives
          </h2>
          <p>
            L’Annuaire des Entreprises est un des services clefs mis en oeuvre
            par l’Etat pour faciliter les démarches des entreprises. Parmi ses
            fonctionnalités, on peut citer :
          </p>
          <h3>Recherche de numéro siret, de numéro siren</h3>
          <p>
            L’Annuaire des Entreprises propose une recherche puissante et simple
            qui permet aux entrepreneurs de retrouver facilement le numéro siret
            de leur(s) entreprise(s) pour l’utiliser dans leurs démarches
            administratives.
          </p>
          <h3>Suppression du KBIS dans les démarches des entreprises</h3>
          <p>
            À partir de Novembre 2021, les entreprises immatriculées au RCS ou
            au RNM n’ont plus à fournir leur extrait KBIS dans leurs démarches
            administratives, le seul numéro siret suffit à l’administration pour
            retrouver les données nécessaires.
          </p>
          <p>
            Ce site permet aux agents d’administrations de retrouver{' '}
            <b>toutes les informations contenues dans un KBIS</b>.
          </p>
          <p>
            <a href="/donnees-extrait-kbis">
              ⇢ Vous êtes un agent ? Consultez notre guide.
            </a>
          </p>
          <div className="layout-center"></div>
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
              : qui donne accès à la base Sirene des entreprises de l’
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
              : les immatriculations d’entreprises artisanales, auprès de{' '}
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
              : les immatriculations d’entreprises auprès des Greffes de
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
            d’accéder aux informations des entreprises détenues par
            l’administration :
          </p>
          <ul>
            <li>les informations d’immatriculation</li>
            <li>le chiffre d’affaires</li>
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
      </TextWrapper>
    </>
  );
};

export default About;
