import { GetStaticProps } from 'next';
import React from 'react';
import TextWrapper from '#components-ui/text-wrapper';
import Meta from '#components/meta';
import {
  administrationsMetaData,
  IAdministrationMetaData,
} from '#models/administrations';
import { NextPageWithLayout } from './_app';

const About: NextPageWithLayout<{
  allAdministrations: IAdministrationMetaData[];
}> = ({ allAdministrations }) => {
  return (
    <>
      <Meta title="Comment ça marche ?" />
      <TextWrapper>
        <h1>À propos de L’Annuaire des Entreprises</h1>
        <h2>Qui développe l’Annuaire des Entreprises ?</h2>
        <p>
          Ce site public est développé et maintenu par{' '}
          <a href="https://etalab.gouv.fr/" target="_blank" rel="noreferrer">
            Etalab
          </a>
          , au sein de la Direction interministérielle du numérique{' '}
          <a
            href="https://www.numerique.gouv.fr/dinum/"
            target="_blank"
            rel="noreferrer"
          >
            (DINUM)
          </a>
          , en coopération avec la{' '}
          <a
            href="https://entreprises.gouv.fr/"
            target="_blank"
            rel="noreferrer"
          >
            Direction Générale des Entreprises (DGE)
          </a>
          . Les informations utilisées proviennent d’administrations publiques
          habilitées à récolter et traiter des données publiques sur les
          entreprises.
        </p>
        <p>
          L’Annuaire des Entreprises ne{' '}
          <b>
            fait que centraliser les données. Il ne les modifie pas et ne les
            stocke pas.
          </b>
        </p>
        <div>
          <h2>
            Comment sont structurées les fiches de l’Annuaire des Entreprises ?{' '}
          </h2>
          <p>
            Les fiches de l’Annuaire regroupe des informations légales sur
            toutes les personnes morales basées en France (entreprises,
            associations, administrations, entrepreneurs…) à travers plusieurs
            onglets :
          </p>
          <ul>
            <li>
              “Résumé” : les informations générales (adresse, SIRET, SIREN, code
              NAF/ APE, numéro de TVA, RNA pour les associations…), les
              informations sur le siège social ainsi que la liste des
              établissements.
            </li>
            <li>
              Justificatif d’immatriculation : permettant d’obtenir le document
              pour prouver l’existence d’une entreprise ou d’une association
              (équivalent des extraits KBIS et D1)
            </li>
            <li>
              Informations sur les dirigeants (d’entreprises) ou élus
              (collectivités)
            </li>
            <li>
              Annonces légales : annonces officielles au Journal Officiel et au
              BODACC (Bulletin Officiel Des Annonces Civiles et Commerciales)
            </li>
            <li>
              Labels et certificats : RGE, ESS, Entrepreneurs de spectacles
              vivants.
            </li>
            <li>
              Conventions collectives : documents enregistrés auprès du
              ministère du travail, du plein l’emploi et de l’insertion
            </li>
          </ul>
          <h2>
            D’où viennent les informations affichées par l’Annuaire des
            Entreprises ?
          </h2>
          <p>
            Toutes les informations affichées sur ce site sont des informations
            publiques, accessibles librement et gratuitement. On appelle cela
            des données ouvertes ou open data.
          </p>
          <p>
            Ces bases de données sont récupérées grâce aux téléservices
            développés par les{' '}
            <a href="/administration">administrations partenaires</a> :
            <ul>
              {allAdministrations.map((administration) => (
                <li>
                  <a href={`/administration#${administration.slug}`}>
                    {administration.long}
                  </a>
                </li>
              ))}
            </ul>
          </p>
          <h2>
            A quel point les données utilisées par l’Annuaire des Entreprises
            sont ouvertes et disponibles ?{' '}
          </h2>
          <p>
            Toutes les données utilisées sont ouvertes en open data et
            accessibles sur{' '}
            <a href="https://data.gouv.fr/" target="_blank" rel="noreferrer">
              data.gouv.fr
            </a>
          </p>
          <p>
            Si vous souhaitez les réutiliser, vous pouvez utiliser les APIs du
            service public qui sont référencées sur
            <a href="https://api.gouv.fr/" target="_blank" rel="noreferrer">
              api.gouv.fr
            </a>
          </p>
          <p>
            Vous pouvez également retrouver les sources de données de l’Annuaire
            et le statut des API utilisées ici :
            <a
              href="https://annuaire-entreprises.data.gouv.fr/sources-de-donnees"
              target="_blank"
              rel="noreferrer"
            >
              https://annuaire-entreprises.data.gouv.fr/sources-de-donnees
            </a>
          </p>
          <p>
            <b>NB</b> : L’Annuaire des Entreprises a développé sa propre API
            pour son moteur de recherche et la met également à disposition
            gratuitement :
            <a
              href="https://api.gouv.fr/les-api/api-recherche-entreprises"
              target="_blank"
              rel="noreferrer"
            >
              l’API Recherche d’entreprises
            </a>
          </p>
          <h2>Réutiliser et partager l’Annuaire des Entreprises</h2>
          <p>Vous souhaitez : </p>
          <ul>
            <li>Ajouter des liens vers des fiches Annuaire sur votre site ?</li>
            <li>
              Aider à la saisie de SIRET et SIREN sur des pages spécifiques ?
            </li>
            <li>Ajouter le moteur de recherche à votre navigateur ?</li>
            <li>Réutiliser nos données ?</li>
            <li>Générer un QR code ?</li>
          </ul>
          <p>
            Découvrez notre guide ici (
            <a
              href="https://annuaire-entreprises.data.gouv.fr/partager"
              target={'_blank'}
              rel="noreferrer"
            >
              https://annuaire-entreprises.data.gouv.fr/partager
            </a>
            ) et n’hésitez pas à nous contacter afin que nous puissions vous
            aider :{' '}
            <a href="mailto:annuaire-entreprises@data.gouv.fr">
              annuaire-entreprises@data.gouv.fr
            </a>
          </p>
          <h2>
            Utilisation du site dans le cadre de démarches et de vérifications
            administratives administratives
          </h2>
          <p>
            L’Annuaire des Entreprises est un des services clefs mis en oeuvre
            par l’Etat pour faciliter les démarches des entreprises. Parmi ses
            fonctionnalités, on peut citer :
          </p>
          <ul>
            <li>
              Proposer aux entrepreneur(e)s un moyen simple et efficace de
              retrouver facilement les informations légales de leur entreprise :
              <b>numéro SIRET, numéro SIREN, numéro de TVA etc.</b> afin de les
              utiliser dans leurs démarches administratives.
            </li>
            <li>
              Permettre aux agents publics de retrouver{' '}
              <b>
                toutes les informations contenues dans un extrait KBIS ou D1
              </b>
              <br />
              <a
                href="https://annuaire-entreprises.data.gouv.fr/donnees-extrait-kbis"
                target="_blank"
                rel="noreferrer"
              >
                ⇢ Vous êtes un agent ? Consultez notre guide.
              </a>
            </li>
            <li>
              Permettre à tout un chacun de vérifier qu’une entreprise existe,
              de consulter ses informations et de lutter contre la fraude. En
              cas de problème, contactez les services de la{' '}
              <a
                href="https://www.economie.gouv.fr/dgccrf"
                target="_blank"
                rel="noreferrer"
              >
                DGCCRF
              </a>{' '}
              et plus particulièrement{' '}
              <a
                href="https://signal.conso.gouv.fr"
                target="_blank"
                rel="noreferrer"
              >
                Signal Conso
              </a>
              dans les cas de fraudes à la consommation.
            </li>
          </ul>
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
          <a href="https://api.gouv.fr/les-api/api-entreprise">
            ⇢ En savoir plus sur API Entreprise
          </a>
        </div>
      </TextWrapper>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { allAdministrations: Object.values(administrationsMetaData) },
  };
};

export default About;
