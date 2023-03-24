import React from 'react';
import TextWrapper from '#components-ui/text-wrapper';
import { INPI, INSEE } from '#components/administrations';
import Meta from '#components/meta';
import { NextPageWithLayout } from './_app';

const ExtraitKbis: NextPageWithLayout = () => {
  return (
    <>
      <Meta title="Comment ça marche ?" />
      <TextWrapper>
        <h1>
          Retrouver les données contenues dans un extrait KBIS ou un extrait D1
        </h1>
        <p>
          Publié en Mai 2021,{' '}
          <a href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000043523262">
            le décret de suppression du KBIS
          </a>{' '}
          supprime le recours aux extraits KBIS (Registre du Commerce) et D1
          (Répertoire des Métiers) dans les démarches administratives des
          personnes morales.
        </p>
        <h2>Qu’est ce qu’un extrait KBIS / D1 ?</h2>
        <p>
          L’extrait d’immatriculation est une preuve de l’immatriculation d’une
          entreprise auprès de son Centre de Formalité des Entreprises (CFE).
        </p>
        <p>
          Il est important de faire la différence entre <b>l’extrait KBIS</b>{' '}
          qui est l’extrait d’immatriculation au Registre du Commerce et des
          Sociétés, qui concerne les <b>entreprises commerciales</b> et{' '}
          <b>l’extrait D1</b> qui est l’extrait d’immatriculation au Répertoire
          des Métiers de la Chambre de Métiers et de l’Artisanat et qui concerne{' '}
          <b>les entreprises artisanales</b>.
        </p>
        <div>
          <h2>
            Comment accéder aux données d’un extrait d’immatriculation via le
            site annuaire-entreprises.data.gouv.fr ?
          </h2>
          <p>
            Pour retrouver les informations d’immatriculation d’une entreprise,{' '}
            <a href="/">utilisez le moteur de recherche</a> pour trouver la page
            de l’entreprise concernée.
          </p>
          <p>
            Une fois sur la page de l’entreprise, consultez l’onglet{' '}
            <b>justificatifs</b> et retrouvez-y les données d’immatriculations,
            soit au Registre National du Commerce et des Sociétés (RNCS), soit
            au Répertoire National des Métiers (RNM).
          </p>
          <h2>
            Comment intégrer les données d’un extrait d’immatriculation à son
            système d’information ?
          </h2>
          <p>
            Vous travailler sur un système d’information et vous avez besoin de
            rendre disponible ces données dans votre site ou votre back-office ?
            Deux choix s’offrent à vous :
          </p>
          <ol>
            <li>
              Utiliser les API : intégrez directement l’API de l’
              <INPI /> à votre système d’information.
            </li>
            <li>
              Intégrer le lien vers la page Annuaire des Entreprises dans votre
              application.
            </li>
          </ol>
          <p>
            <b>NB :</b> le lien se construit ainsi :
          </p>
          <code>
            https://annuaire-entreprises.data.gouv.fr/justificatifs/
            <i>{'{insérer_le_numéro_siren}'}</i>
          </code>
          <h2>
            Quelles sont les API qui donnent accès aux données d’immatriculation
            des entreprises ?
          </h2>
          <p>
            Toutes les sources de données affichées sur le site sont accessibles
            grâce à l’API Registre National des Entreprises de l’
            <INPI />.
          </p>
          <p>
            <b>NB :</b> toutes les APIs du service public sont référencées sur{' '}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://api.gouv.fr"
            >
              api.gouv.fr
            </a>
            .
          </p>
          <h2>
            Accéder à plus de données sur les entreprises et les associations
            via API
          </h2>
          <p>
            Il existe une API spéciale, <b>API Entreprise</b> réservée aux
            administrations et à certaines entreprises éligibles, qui permet
            d’accéder aux informations des entreprises détenue par
            l’administration :
          </p>
          <ul>
            <li>
              les informations de la base sirene de l’
              <INSEE />
            </li>
            <li>le chiffre d’affaire</li>
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

export default ExtraitKbis;
