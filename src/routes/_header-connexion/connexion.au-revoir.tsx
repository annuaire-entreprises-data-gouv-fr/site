import { createFileRoute } from "@tanstack/react-router";
import { Link } from "#/components/Link";
import { ConnexionSubLayout } from "#/components-ui/connexion-layout";
import logoutPicture from "#/components-ui/illustrations/logout";
import { meta } from "#/utils/seo";
import { HeaderConnexionError } from "./-error";

export const Route = createFileRoute("/_header-connexion/connexion/au-revoir")({
  head: () => {
    const canonical =
      "https://annuaire-entreprises.data.gouv.fr/connexion/au-revoir";
    return {
      meta: meta({
        title: "Vous êtes bien deconnecté",
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
    <ConnexionSubLayout img={logoutPicture}>
      <h1>Vous êtes bien déconnecté(e)</h1>
      <p>Merci de votre visite</p>
      <Link to="/">← Revenir au moteur de recherche</Link>
    </ConnexionSubLayout>
  );
}
