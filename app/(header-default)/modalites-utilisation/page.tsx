import type { Metadata } from "next";
import TextWrapper from "#components-ui/text-wrapper";

export const metadata: Metadata = {
  title: "Modalités d’utilisation",
  robots: "noindex, nofollow",
  alternates: {
    canonical:
      "https://annuaire-entreprises.data.gouv.fr/modalites-utilisation",
  },
};

const CGU = () => (
  <TextWrapper>
    <h1>Modalités d’utilisation</h1>
    <h2>1 - Champ d’application</h2>
    <p>
      Le présent document définit les modalités d’utilisation du service
      Annuaire des Entreprises, accessible à la page{" "}
      <a href="https://annuaire-entreprises.data.gouv.fr">
        https://annuaire-entreprises.data.gouv.fr
      </a>
      .
    </p>
    <h2>2 - Objet de la plateforme</h2>
    <p>
      Le service permet d’accéder aux informations administratives et
      économiques des entreprises, des associations et des administrations
      immatriculés dans un registre national.
    </p>
    <p>
      L’Annuaire des Entreprises est développé et opéré par la Direction
      interministérielle du numérique (DINUM).
    </p>
    <p>
      Toute utilisation de ce service doit respecter les présentes modalités
      d’utilisation.
    </p>

    <h2>3 - Accès au service</h2>
    <p>
      L’Annuaire des Entreprises est mis à disposition du grand public pour les
      informations et données ouvertes au sens du livre III du code des
      relations entre le public et l’administration (CRPA). Cette utilisation
      est libre et gratuite.
    </p>
    <p>
      Pour les données soumises à un secret, au sens des articles L. 311-5 et L.
      311-6 du CRPA, l’affichage est subordonné à l’utilisation d’un compte «
      agent public » et au besoin d’en connaître de l’utilisateur ou
      l’utilisatrice. Le compte « agent public » correspond à un accès depuis
      ProConnect d’une personne identifiée comme agent d’une administration
      listée comme répondant aux exigences de l’article L. 100-3 du CRPA. La
      liste de ces administrations est accessible sur :
    </p>
    <p>
      <a href="https://www.data.gouv.fr/fr/datasets/liste-des-administrations-francaises/">
        https://www.data.gouv.fr/fr/datasets/liste-des-administrations-francaises/
      </a>
      .
    </p>
    <h2>4 - Fonctionnalités</h2>
    <h3>4.1 Accès et connexion à l’espace agent public</h3>
    <p>
      Pour accéder à l’espace « agent public », l’utilisateur ou l’utilisatrice
      s’authentifie et se connecte à depuis le fournisseur d’identité
      ProConnect.
    </p>
    <p>
      Le service ne propose aucun autre mode d’accès à cet espace agent public.
    </p>
    <p>
      L’accès à l’espace « agent public » est limité aux seuls agents publics,
      contractuels ou fonctionnaires, d’une administration au sens du L. 100-3
      du CRPA.
    </p>
    <h3>
      4.2 Accès aux informations légales des sociétés, associations et services
      publics
    </h3>
    <p>
      À partir de l’espace « agent public », l’utilisateur ou l’utilisatrice
      peut consulter et extraire les informations et données nécessaires à sa
      mission, dont celles dites « non-diffusibles », de l’ensemble des
      structures disposant d’un numéro de SIRET.
    </p>
    <p>
      L’accès à certaines informations et données nécessite de déclarer le cas
      d’usage le rendant nécessaire.
    </p>
    <h2>
      5 - Engagements et responsabilités des utilisateurs et utilisatrices de
      l’espace « agent public »
    </h2>
    <h3>5.1 Usages conformes</h3>
    <p>
      Le service est mis à disposition par la DINUM pour simplifier l’accès des
      agents publics aux informations relatives aux administrations, entreprises
      et associations.
    </p>
    <p>
      L’utilisateur ou l’utilisatrice s’assure de garder secret son accès au
      service ProConnect. Toute divulgation du mot de passe de cet accès, quelle
      que soit sa forme, est interdite. Il ou elle assume les risques liés à
      l’utilisation de son identifiant et mot de passe ProConnect.
    </p>
    <p>
      Dans le cadre de l’utilisation de son espace « agent public »,
      l’utilisateur ou l’utilisatrice doit observer une obligation de secret
      professionnel, notamment prévu par l’article L. 121-6 du code général de
      la fonction publique et l’article 1-1 du décret n° 86-83 du 17 janvier
      1986.
    </p>
    <p>
      Les éventuelles extractions de données et informations accessibles depuis
      l’espace « agent public » doivent être réalisées dans des conditions
      garantissant leur intégration, sécurité et confidentialité. Cette
      obligation perdure aussi longtemps que les informations ou données sont
      protégées par un secret.
    </p>
    <h3>5.2 Usages interdits</h3>
    <p>
      L’utilisateur ou l’utilisatrice s’interdit de commercialiser, diffuser
      publiquement ou communiquer à des tiers qui n’ont pas à en connaître les
      informations et données du service depuis l’espace « agent public » qui
      sont couvertes par un secret protégé par la loi (ex : secret des
      affaires).
    </p>
    <p>
      L’utilisateur ou l’utilisatrice s’engage à ne pas mettre en ligne de
      contenus ou informations contraires aux dispositions légales et
      réglementaires en vigueur.
    </p>
    <p>
      Pour accéder à certaines informations sur les organismes, depuis son
      espace « agent public », l’utilisateur ou l’utilisatrice doit déclarer un
      cas d’usage nécessitant cet accès. Dans ce cadre, il est rappelé que toute
      personne procédant à une fausse déclaration pour elle-même ou pour autrui
      s’expose, notamment, aux sanctions prévues à l’article 441-1 du code
      pénal, prévoyant des peines pouvant aller jusqu’à trois ans
      d’emprisonnement et 45 000 euros d’amende.
    </p>
    <h2>6 - Engagements et responsabilités de la DINUM</h2>
    <h3>6.1 Sécurité et accès à la Plateforme</h3>
    <p>
      Les sources des informations et données diffusées sur la plateforme sont
      réputées fiables mais elle ne garantit pas qu’elle soit exempte de
      défauts, d’erreurs ou d’omissions.
    </p>
    <p>
      La DINUM s’engage à la sécurisation de la plateforme, notamment en prenant
      toutes les mesures nécessaires permettant de garantir la sécurité et la
      confidentialité des informations fournies depuis la connexion ProConnect.
    </p>
    <p>
      La DINUM s’engage à fournir les moyens nécessaires et raisonnables pour
      assurer un accès continu à la plateforme.
    </p>
    <p>
      La DINUM se réserve le droit de faire évoluer, de modifier ou de
      suspendre, sans préavis, le service pour des raisons de maintenance ou
      pour tout autre motif jugé nécessaire.
    </p>
    <p>
      La DINUM se réserve le droit de suspendre ou supprimer un compte « agent
      public » d’utilisateur ou d’utilisatrice du service qui aurait méconnu les
      présentes modalités d’utilisation et à en informer son employeur, sans
      préjudice des éventuelles actions en responsabilité pénale et civile qui
      pourraient être engagées à l’encontre de l’utilisateur ou l’utilisatrice.
    </p>
    <h3>6.2 Open Source et Licences</h3>
    <p>
      Le code source de la plateforme est libre, sous licence MIT, et disponible
      ici :
    </p>
    <p>
      <a href="https://github.com/annuaire-entreprises-data-gouv-fr">
        https://github.com/annuaire-entreprises-data-gouv-fr
      </a>
      .
    </p>
    <p>
      Les contenus proposés par la DINUM sont sous Licence Ouverte, à
      l’exception des logos et des représentations iconographiques et
      photographiques pouvant être régis par leurs licences propres.
    </p>
    <h2>7 - Évolution des modalités d’utilisation</h2>
    <p>
      Les termes des présentes modalités d’utilisation peuvent être modifiés ou
      complétés à tout moment, sans préavis, en fonction des modifications
      apportées au service, de l’évolution de la législation ou pour tout autre
      motif jugé nécessaire. Ces modifications et mises à jour s’imposent à
      l’utilisateur ou l’utilisatrice qui doit, en conséquence, se référer
      régulièrement à cette rubrique pour vérifier les conditions générales en
      vigueur.
    </p>
    <h2>8 - Accessibilité</h2>
    <p>
      Vous pouvez nous aider à améliorer l’accessibilité du site en nous
      signalant les problèmes éventuels que vous rencontrez. Pour ce faire,
      envoyez-nous un courriel à{" "}
      <a href="mailto:annuaire-entreprises@data.gouv.fr">
        annuaire-entreprises@data.gouv.fr
      </a>
      . Si vous nous avez signalé un défaut d’accessibilité vous empêchant
      d’accéder à un contenu ou à un des services et que vous n’avez pas obtenu
      de réponse satisfaisante de notre part, vous pouvez :
    </p>
    <ul>
      <li>
        Écrire un message au Défenseur des droits à l’aide du formulaire
        accessible sur{" "}
        <a href="https://formulaire.defenseurdesdroits.fr">
          https://formulaire.defenseurdesdroits.fr
        </a>
      </li>
      <li>
        Envoyer un courrier par La Poste (gratuit, sans affranchissement) à :
        <br />
        Défenseur des droits
        <br />
        Libre réponse 71120
        <br />
        75342 Paris
        <br />
        CEDEX 07
      </li>
    </ul>
  </TextWrapper>
);

export default CGU;
