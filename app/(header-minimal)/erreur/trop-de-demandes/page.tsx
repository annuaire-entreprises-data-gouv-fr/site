import type { Metadata } from "next";
import ButtonLink from "#components-ui/button";
import constants from "#models/constants";

export const metadata: Metadata = {
  title: "Trop de requête de votre part",
  robots: "noindex, nofollow",
};

const TooManyRequestPage = () => (
  <>
    <h1>Nous avons reçu trop de demandes de votre part 📈</h1>
    <p>
      Notre site a reçu trop de demandes de la part de votre adresse IP en un
      temps très court, par conséquent nous ne pouvons pas répondre à votre
      requête.
    </p>

    <ul>
      <li>
        Si vous travaillez <strong>pour une administration</strong> (agence,
        ministère, collectivité), contactez-nous via notre{" "}
        <a href={constants.links.parcours.contact}>formulaire de contact</a> et
        nous ferons le nécessaire pour que cela ne se reproduise pas.
      </li>
      <li>
        Si <strong>vous utilisez des robots 🤖</strong> pour scrapper les
        données du site.{" "}
        <strong>Sachez que toutes les données sont publiques !</strong> Alors{" "}
        <a href="/donnees/sources">
          utilisez les jeux de données directement ou l’API
        </a>
        . Cela sera plus stable et efficace pour tout le monde.
      </li>
    </ul>
    <p>
      Si le problème se reproduit, vous pouvez nous contacter via notre FAQ.
    </p>
    <ul className="fr-btns-group fr-btns-group--inline-md">
      <li>
        <ButtonLink alt to="/faq">
          Accéder à la FAQ
        </ButtonLink>
      </li>
      <li>
        <ButtonLink to="/">Retourner à la page d’accueil</ButtonLink>
      </li>
    </ul>
  </>
);

export default TooManyRequestPage;
