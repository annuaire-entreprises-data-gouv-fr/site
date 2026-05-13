import { createFileRoute } from "@tanstack/react-router";
import { Link } from "#/components/Link";
import { ConnexionSubLayout } from "#/components-ui/connexion-layout";
import connexionFailedPicture from "#/components-ui/illustrations/connexion-failed";
import constants from "#/models/constants";
import { meta } from "#/seo";
import { HeaderConnexionError } from "./-error";

export const Route = createFileRoute(
  "/_header-connexion/connexion/echec-connexion"
)({
  head: () => {
    const canonical =
      "https://annuaire-entreprises.data.gouv.fr/connexion/echec-connexion";
    return {
      meta: meta({
        title: "Votre tentative de connexion a échoué",
        robots: {
          follow: false,
        },
        alternates: {
          canonical,
        },
      }),
      links: [
        {
          rel: "canonical",
          href: canonical,
        },
      ],
    };
  },
  component: RouteComponent,
  errorComponent: HeaderConnexionError,
});

function RouteComponent() {
  return (
    <ConnexionSubLayout img={connexionFailedPicture}>
      <h1>Votre tentative de connexion a échoué</h1>
      <p>
        Merci de réessayer plus tard. Si le problème se reproduit, merci de{" "}
        <Link to={constants.links.parcours.contact}>nous contacter.</Link>
      </p>
      <Link to="/">← Retourner au moteur de recherche</Link>
    </ConnexionSubLayout>
  );
}
