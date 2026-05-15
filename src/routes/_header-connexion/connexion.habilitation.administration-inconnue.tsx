import { createFileRoute } from "@tanstack/react-router";
import { Link } from "#/components/Link";
import { ConnexionSubLayout } from "#/components-ui/connexion-layout";
import connexionRefusedPicture from "#/components-ui/illustrations/connexion-refused";
import constants from "#/models/constants";
import { meta } from "#/seo";
import { HeaderConnexionError } from "./-error";

export const Route = createFileRoute(
  "/_header-connexion/connexion/habilitation/administration-inconnue"
)({
  head: () => {
    const canonical =
      "https://annuaire-entreprises.data.gouv.fr/connexion/habilitation/administration-inconnue";
    return {
      meta: meta({
        title: "Votre administration est inconnue de nos services",
        robots: "noindex, nofollow",
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
    <ConnexionSubLayout img={connexionRefusedPicture}>
      <h1>Votre administration est inconnue de nos services</h1>
      <p>
        Votre administration est encore inconnue de nos services. Pouvez-vous
        s’il vous plait{" "}
        <Link to={constants.links.parcours.contact}>nous contacter</Link>, afin
        que nous vous activions les accès ?
      </p>
      <Link to="/">← Retourner au moteur de recherche</Link>
    </ConnexionSubLayout>
  );
}
