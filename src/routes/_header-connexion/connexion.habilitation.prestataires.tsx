import { createFileRoute } from "@tanstack/react-router";
import { Link } from "#/components/Link";
import { ConnexionSubLayout } from "#/components-ui/connexion-layout";
import connexionRefusedPicture from "#/components-ui/illustrations/connexion-refused";
import constants from "#/models/constants";
import { meta } from "#/utils/seo";
import { HeaderConnexionError } from "./-error";

export const Route = createFileRoute(
  "/_header-connexion/connexion/habilitation/prestataires"
)({
  head: () => {
    const canonical =
      "https://annuaire-entreprises.data.gouv.fr/connexion/habilitation/prestataires";
    return {
      meta: meta({
        title: "Vous n’êtes pas autorisé(e) à accéder à l’espace agent",
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
      <h1>Vous n’êtes pas autorisé(e) à accéder à l’espace agent</h1>
      <div>
        Les prestataires ne sont pas autorisés à accéder à l’espace agent
        public.
      </div>
      <p>
        Si vous n’êtes pas prestataire vous pouvez{" "}
        <Link to={constants.links.parcours.contact}>nous contacter</Link> pour
        que nous étudions votre situation.
      </p>
      <Link to="/">← Retourner au moteur de recherche</Link>
    </ConnexionSubLayout>
  );
}
