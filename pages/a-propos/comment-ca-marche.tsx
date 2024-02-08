import TextWrapper from '#components-ui/text-wrapper';
import Meta from '#components/meta';
import { administrationsMetaData } from '#models/administrations';
import { NextPageWithLayout } from '../_app';

const About: NextPageWithLayout = () => {
  const allAdministrations = Object.values(administrationsMetaData);
  return (
    <>
      <Meta
        title="Comment ça marche ?"
        canonical="https://annuaire-entreprises.data.gouv.fr/a-propos/comment-ca-marche"
      />
      <TextWrapper>
        <h1>À propos de L’Annuaire des Entreprises</h1>
        <p>
          Ce site permet de retrouver toutes les données publiques détenues par
          l’administration sur une entreprise, une association ou une
          administration.
        </p>
        <p>
          Ce site ne fait{' '}
          <strong>
            que centraliser les données. Il ne les modifie pas et ne les stocke
            pas.
          </strong>
        </p>
        <p>
          Il est opéré par{' '}
          <a href="/equipe">
            une équipe de la Direction Interministérielle du Numérique
          </a>
          .
        </p>
        <div>
          <h2>Que trouve-t-on dans l’Annuaire des Entreprises ?</h2>
          <p>
            Les fiches de l’Annuaire regroupe des informations légales sur
            toutes les personnes morales basées en France (entreprises,
            associations, administrations, entrepreneurs…) à travers plusieurs
            onglets :
          </p>
          <ul>
            <li>
              <strong>Résumé :</strong> les informations générales (adresse,
              SIRET, SIREN, code NAF/ APE, numéro de TVA, RNA pour les
              associations…), les informations sur le siège social ainsi que la
              liste des établissements.
            </li>
            <li>
              <strong>Justificatif d’immatriculation :</strong> permettant
              d’obtenir le document pour prouver l’existence d’une entreprise ou
              d’une association (équivalent des extraits KBIS et D1)
            </li>
            <li>
              Informations sur les <strong>dirigeants</strong> (d’entreprises)
              ou élus (collectivités)
            </li>
            <li>
              <strong>Annonces légales :</strong> annonces officielles au
              Journal Officiel et au BODACC (Bulletin Officiel Des Annonces
              Civiles et Commerciales)
            </li>
            <li>
              <strong>Données financières des entreprises :</strong> chiffre
              d’affaires et résultat net des sociétés
            </li>
            <li>
              <strong>Annonces légales :</strong> annonces officielles au
              Journal Officiel et au BODACC (Bulletin Officiel Des Annonces
              Civiles et Commerciales)
            </li>
            <li>
              <strong>Labels et certificats :</strong> RGE, ESS, Société à
              mission, Entrepreneurs de spectacles vivants, entreprises du Bio
            </li>
            <li>
              <strong>Conventions collectives :</strong> documents enregistrés
              auprès du ministère du travail, du plein l’emploi et de
              l’insertion
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
                <li key={administration.slug}>
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
            .
          </p>
          <p>
            Si vous souhaitez les réutiliser, vous pouvez utiliser les APIs du
            service public qui sont référencées sur{' '}
            <a href="https://api.gouv.fr/" target="_blank" rel="noreferrer">
              api.gouv.fr
            </a>
            .
          </p>
          <p>
            Vous pouvez également retrouver les{' '}
            <a href="/donnees/sources">sources de données</a> de l’Annuaire et{' '}
            <a href="/donnees/api">statut des API utilisées</a>.
          </p>
          <p>
            <strong>NB</strong> : L’Annuaire des Entreprises a développé sa
            propre API pour son moteur de recherche et la met également à
            disposition gratuitement :{' '}
            <a
              href="https://api.gouv.fr/les-api/api-recherche-entreprises"
              target="_blank"
              rel="noreferrer"
            >
              l’API Recherche d’entreprises
            </a>
            .
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
            Découvrez notre{' '}
            <a href="https://annuaire-entreprises.data.gouv.fr/partager">
              guide sur le sujet
            </a>{' '}
            et n’hésitez pas à nous contacter afin que nous puissions vous aider
            :{' '}
            <a href="mailto:annuaire-entreprises@data.gouv.fr">
              annuaire-entreprises@data.gouv.fr
            </a>
            .
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
              retrouver facilement les informations légales de leur entreprise :{' '}
              <strong>numéro SIRET, numéro SIREN, numéro de TVA etc.</strong>{' '}
              afin de les utiliser dans leurs démarches administratives.
            </li>
            <li>
              Permettre aux agents publics de retrouver{' '}
              <a href="https://annuaire-entreprises.data.gouv.fr/donnees-extrait-kbis">
                toutes les informations contenues dans un extrait KBIS ou D1
              </a>
              .
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
              </a>{' '}
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

export default About;
