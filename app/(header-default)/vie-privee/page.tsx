import { Metadata } from 'next';
import TextWrapper from '#components-ui/text-wrapper';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  robots: 'noindex, nofollow',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/vie-privee',
  },
};

const Privacy = () => (
  <TextWrapper>
    <h1>Politique de confidentialité</h1>
    <h2>Qui est responsable de l’Annuaire des Entreprises ?</h2>
    <p>
      La Direction interministérielle du numérique (“DINUM”) met à disposition
      des usagers et des agents publics un service numérique unique regroupant
      et diffusant les informations légales publiques des entreprises,
      associations et services publics en France. Ce service traite des données
      à caractère personnel.
    </p>
    <p>
      Le responsable du traitement des données à caractère personnel est la
      DINUM représentée par Madame Stéphanie SCHAER, en qualité de directrice.
    </p>
    <h2>Pourquoi traitons-nous ces données ?</h2>
    <p>
      L’Annuaire des Entreprises traite des données à caractère personnel pour :
    </p>
    <ul>
      <li>
        Agréger et diffuser les informations légales publiques des entreprises,
        associations et services publics en France ;
      </li>
      <li>
        Faciliter la découvrabilité des informations légales publiques de ces
        structures ;
      </li>
      <li>
        Gérer les accès auxdites informations en fonction de leur niveau de
        sensibilité.
      </li>
    </ul>
    <h2>Quelles sont les données que nous traitons ?</h2>
    <p>
      L’Annuaire des Entreprises traite les données à caractère personnel
      suivantes :
    </p>
    <div className="fr-table">
      <table>
        <caption>
          Résumé des différentes durées de conservation des données
        </caption>
        <thead>
          <tr>
            <th>Catégories de données</th>
            <th>Données à caractère personnel</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              Données relatives aux représentants des entreprises, associations,
              services publics
            </td>
            <td>Nom, prénom</td>
          </tr>
          <tr>
            <td>
              Données relatives aux bénéficiaires effectifs des entreprises,
              associations, services publics
            </td>
            <td>Nom, prénom</td>
          </tr>
          <tr>
            <td>
              Données relatives aux agents publics accédant au service numérique
              via ProConnect
            </td>
            <td>Nom, prénom, adresse e-mail professionnelle</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      Les données des dirigeants et des bénéficiaires effectifs sont collectées
      via les services suivants : Institut national de la statistique et des
      études économiques (Insee), Institut national de la propriété industrielle
      (INPI), la Direction de l’information légale et administrative (DILA).
      Pour plus d’informations, voir{' '}
      <a href="https://annuaire-entreprises.data.gouv.fr/donnees/sources">
        ici
      </a>
      .
    </p>
    <h2>Qu’est-ce qui nous autorise à traiter ces données ?</h2>
    <p>
      L’Annuaire des Entreprises traite des données à caractère personnel en se
      basant sur :
    </p>
    <ul>
      <li>
        L’exécution d’une mission d’intérêt public ou relevant de l’exercice de
        l’autorité publique dont est investi le responsable de traitement au
        sens de l’article 6-1 e) du RGPD.
      </li>
    </ul>
    <p>
      Cette mission d’intérêt public se traduit en pratique par le décret
      n°2023-304 du 22 avril 2023 modifiant le décret n°2019-1088 du 25 octobre
      2019 relatif au système d’information et de communication de l’Etat et à
      la direction interministérielle du numérique, notamment son article 6.
    </p>
    <h2>Pendant combien de temps conservons-nous ces données ?</h2>
    <div className="fr-table">
      <table>
        <caption>
          Résumé des différentes durées de conservation des données
        </caption>
        <thead>
          <tr>
            <th>Type de données</th>
            <th>Durée de la conservation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              Données relatives aux représentants des entreprises, associations
              et services publics
            </td>
            <td>
              Jusqu’à 10 ans suivant la cessation de l’activité de l’entreprise,
              l’association ou le service public concerné
            </td>
          </tr>
          <tr>
            <td>
              Données relatives aux bénéficiaires effectifs des entreprises,
              associations, services publics
            </td>
            <td>
              Jusqu’à 10 ans suivant la cessation de l’activité de l’entreprise,
              l’association ou le service public concerné
            </td>
          </tr>
          <tr>
            <td>
              Données relatives aux agents publics accédant au service numérique
              via ProConnect
            </td>
            <td>
              Durant la durée de session de la personne concernée, au-delà les
              données sont détruites sans délai. En cas de déconnexion ou
              d’expiration de la session, l’Agent doit dès lors se reconnecter à
              l’aide de ses identifiants.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      Pour mémoire, les données qui transitent via l’API Annuaire des
      Entreprises sont supprimées des serveurs au bout d’une dizaine de minutes.
    </p>
    <h2>Quels droits avez-vous ?</h2>
    <p>Vous disposez :</p>
    <ul>
      <li>D’un droit d’information et d’un droit d’accès à vos données ;</li>
      <li>D’un droit de rectification ;</li>
      <li>D’un droit d’opposition ;</li>
      <li>D’un droit à la limitation du traitement.</li>
    </ul>
    <p>
      Pour les exercer, contactez-nous à :{' '}
      <a href="mailto:annuaire-entreprises@data.gouv.fr">
        annuaire-entreprises@data.gouv.fr{' '}
      </a>
    </p>
    <p>Ou bien à :</p>
    <ul>
      <li>
        L’adresse postale suivante : DINUM, à l’attention d’Annuaire des
        entreprises, 20 avenue de Ségur, 75007 PARIS
      </li>
      <li>L’adresse e-mail suivante : dpd@pm.gouv.fr </li>
    </ul>
    <p>
      Puisque ce sont des droits personnels, nous ne traiterons votre demande
      que si nous sommes en mesure de vous identifier. Dans le cas où nous ne
      parvenons pas à vous identifier, nous pourrions être amenés à vous
      demander une preuve de votre identité.
    </p>
    <p>
      Pour vous aider dans votre démarche, vous trouverez{' '}
      <a href="https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces">
        un modèle de courrier élaboré par la CNIL
      </a>
      .
    </p>
    <p>
      Nous nous engageons à vous répondre dans un délai raisonnable qui ne
      saurait dépasser 1 mois à compter de la réception de votre demande.
    </p>
    <p>
      Vous pouvez introduire une réclamation auprès de la{' '}
      <a href="https://www.cnil.fr/fr/cnil-direct/question/adresser-une-reclamation-plainte-la-cnil-quelles-conditions-et-comment">
        CNIL
      </a>
      .
    </p>
    <h2>Qui va avoir accès à ces données ?</h2>
    <p>
      Les accès aux données sont strictement encadrés et juridiquement
      justifiés. Les personnes suivantes vont avoir accès aux données :
    </p>
    <ul>
      <li>Les membres du service numérique l’Annuaire des Entreprises ;</li>
      <li>
        Les utilisateurs de l’API uniquement pour les données relatives aux
        représentants et bénéficiaires effectifs des entreprises, associations
        et services publics ;
      </li>
      <li>
        Les usagers du service et agents publics accédant au service via
        ProConnect, diffusion publique des données relatives aux représentants
        et bénéficiaires effectifs des entreprises, associations et services
        publics et accès via un compte pour les agents publics.
      </li>
    </ul>
    <h2>Quelles mesures de sécurité mettons-nous en place ?</h2>
    <p>Nous mettons en place plusieurs mesures pour sécuriser les données :</p>
    <ul>
      <li>Stockage des données en base de données ;</li>
      <li>Cloisonnement des données ;</li>
      <li>Mesures de traçabilité ;</li>
      <li>Surveillance ;</li>
      <li>Protection contre les virus, malwares et logiciels espions ;</li>
      <li>Protection des réseaux ;</li>
      <li>Sauvegarde ;</li>
      <li>
        Mesures restrictives limitant l’accès physique aux données à caractère
        personnel.
      </li>
    </ul>
    <h2>Qui nous aide à traiter les données ?</h2>
    <p>
      Certaines des données sont envoyées à d’autres acteurs, appelés
      “sous-traitants de données”, pour qu’ils nous aident à les manipuler. Nous
      nous assurons qu’ils respectent strictement le RGPD et qu’ils apportent
      des garanties suffisantes en matière de sécurité.
    </p>
    <div className="fr-table">
      <table>
        <caption>Résumé des différents sous-traitants</caption>
        <thead>
          <tr>
            <th>Sous-traitant</th>
            <th>Pays destinataire</th>
            <th>Traitement réalisé</th>
            <th>Garanties</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>OVH</td>
            <td>France</td>
            <td>Hébergement</td>
            <td>https://www.ovh.com/fr/protection-donnees-personnelles/</td>
          </tr>
          <tr>
            <td>Scalingo</td>
            <td>France</td>
            <td>Hébergement de test</td>
            <td>
              https://scalingo.com/fr/contrat-gestion-traitements-donnees-personnelles
            </td>
          </tr>
          <tr>
            <td>Crisp</td>
            <td>France</td>
            <td>Gestion du support</td>
            <td>https://crisp.chat/fr/privacy/</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2>Cookies</h2>
    <p>
      Un cookie est un fichier déposé sur votre terminal lors de la visite d’un
      site. Il a pour but de collecter des informations relatives à votre
      navigation et de vous adresser des services adaptés à votre terminal
      (ordinateur, mobile ou tablette).
    </p>
    <p>
      En application de l’article 5(3) de la directive 2002/58/CE modifiée
      concernant le traitement des données à caractère personnel et la
      protection de la vie privée dans le secteur des communications
      électroniques, transposée à l’article 82 de la loi n°78-17 du 6 janvier
      1978 relative à l’informatique, aux fichiers et aux libertés, les traceurs
      ou cookies suivent deux régimes distincts.
    </p>
    <p>
      Les cookies strictement nécessaires au service ou ayant pour finalité
      exclusive de faciliter la communication par voie électronique sont
      dispensés de consentement préalable au titre de l’article 82 de la loi
      n°78-17 du 6 janvier 1978.
    </p>
    <p>
      Les cookies n’étant pas strictement nécessaires au service ou n’ayant pas
      pour finalité exclusive de faciliter la communication par voie
      électronique doivent être consentis par l’utilisateur.
    </p>
    <p>
      Ce consentement de la personne concernée pour une ou plusieurs finalités
      spécifiques constitue une base légale au sens du RGPD et doit être entendu
      au sens de l’article 6-a du Règlement (UE) 2016/679 du Parlement européen
      et du Conseil du 27 avril 2016 relatif à la protection des personnes
      physiques à l’égard du traitement des données à caractère personnel et à
      la libre circulation de ces données.
    </p>
    <p>
      À tout moment, vous pouvez refuser l’utilisation des cookies et désactiver
      le dépôt sur votre ordinateur en utilisant la fonction dédiée de votre
      navigateur (fonction disponible notamment sur Microsoft Internet Explorer
      11, Google Chrome, Mozilla Firefox, Apple Safari et Opera).
    </p>
    <p>
      Des cookies relatifs aux statistiques publiques et anonymes sont également
      déposés.
    </p>
    <p>Cookies recensés sur l’Annuaire des entreprises :</p>
    <div className="fr-table">
      <table>
        <caption>Résumé des cookies</caption>
        <thead>
          <tr>
            <th>Sous-traitant</th>
            <th>Finalités</th>
            <th>Hébergement</th>
            <th>Garanties</th>
            <th>Durées de conservation du cookie</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>pk_id</td>
            <td>Mesure d’audience</td>
            <td>France</td>
            <td>https://fr.matomo.org/matomo-cloud-dpa/</td>
            <td>13 mois</td>
          </tr>
          <tr>
            <td>pk_ref</td>
            <td>Mesure d’audience</td>
            <td>France</td>
            <td>https://fr.matomo.org/matomo-cloud-dpa/</td>
            <td>6 mois</td>
          </tr>
          <tr>
            <td>pk_ses</td>
            <td>Mesure d’audience</td>
            <td>France</td>
            <td>https://fr.matomo.org/matomo-cloud-dpa/</td>
            <td>30 minutes</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      L’Anuaire des Entreprises utilise l’outil de mesure d’audience Matomo,
      configuré en mode exempté, et ne nécessitant pas le recueil de votre
      consentement conformément aux recommandations de la CNIL.{' '}
    </p>
    <p>
      Vous êtes suivis de manière anonyme, décochez la case pour ne plus être
      suivis même anonymement.
    </p>
    <iframe
      style={{
        overflow: 'visible',
        borderWidth: '0',
        width: '100%',
      }}
      title="Optout cookie"
      src="https://stats.data.gouv.fr/index.php?module=CoreAdminHome&action=optOut&language=fr&backgroundColor=&fontColor=333&fontSize=16px&fontFamily=sans-serif&overflow=visible"
    ></iframe>

    <p>
      Pour aller plus loin, vous pouvez consulter les ﬁches proposées par la
      Commission Nationale de l’Informatique et des Libertés (CNIL) :
    </p>
    <ul>
      <li>
        <a href="https://www.cnil.fr/fr/cookies-traceurs-que-dit-la-loi">
          Cookies & traceurs : que dit la loi ?
        </a>
      </li>
      <li>
        <a href="https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser">
          Cookies : les outils pour les maîtriser
        </a>
      </li>
    </ul>
  </TextWrapper>
);

export default Privacy;
