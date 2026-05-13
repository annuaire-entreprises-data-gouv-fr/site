import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Link } from "#/components/Link";
import { ConnexionSubLayout } from "#/components-ui/connexion-layout";
import connexionRefusedPicture from "#/components-ui/illustrations/connexion-refused";
import { meta } from "#/seo";
import { queryString } from "#/utils/query";
import { HeaderConnexionError } from "./-error";

export const Route = createFileRoute(
  "/_header-connexion/connexion/habilitation/refusee"
)({
  head: () => {
    const canonical =
      "https://annuaire-entreprises.data.gouv.fr/connexion/habilitation/refusee";
    return {
      meta: meta({
        title: "Accès à l’espace agent refusé",
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
  validateSearch: z.object({
    siren: queryString,
    name: queryString.optional(),
  }),
  component: RouteComponent,
  errorComponent: HeaderConnexionError,
});

function RouteComponent() {
  const { siren, name } = Route.useSearch();

  return (
    <ConnexionSubLayout img={connexionRefusedPicture}>
      <h1>L’accès à l’espace agent vous est refusé</h1>
      <div>
        Seuls les membres d’une administration peuvent accéder à l’espace agent
        public.
      </div>
      <p>
        L'organisation à laquelle vous appartenez (
        <Link params={{ slug: siren }} to="/entreprise/$slug">
          {name || siren}
        </Link>
        ) n'est pas une administration et par conséquent, l'accès à l'espace
        agent vous est refusé.
      </p>
      <Link to="/">← Retourner au moteur de recherche</Link>
    </ConnexionSubLayout>
  );
}
