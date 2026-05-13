import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Link } from "#/components/Link";
import { ConnexionSubLayout } from "#/components-ui/connexion-layout";
import connexionRefusedPicture from "#/components-ui/illustrations/connexion-refused";
import { meta } from "#/seo";
import { queryString } from "#/utils/query";
import { HeaderConnexionError } from "./-error";

export const Route = createFileRoute(
  "/_header-connexion/connexion/habilitation/requise"
)({
  head: () => {
    const canonical =
      "https://annuaire-entreprises.data.gouv.fr/connexion/habilitation/requise";
    return {
      meta: meta({
        title: "Vous n’êtes pas autorisé(e) à accéder à l’espace agent",
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
      <h1>Vous n’êtes pas autorisé(e) à accéder à l’espace agent</h1>
      <div>
        Seuls peuvent accéder à l’espace agent public les membres d’une
        administration autorisée.
      </div>
      <p>
        L'organisation à laquelle vous appartenez (
        <Link params={{ slug: siren }} to="/entreprise/$slug">
          {name || siren}
        </Link>
        ) <strong>ne fait pas partie</strong> de la{" "}
        <a href="https://www.data.gouv.fr/fr/datasets/liste-des-administrations-francaises/">
          liste des administrations autorisées
        </a>
        . Si vous pensez que votre organisation est bien autorisée, vous pouvez{" "}
        <a href="https://demarche.numerique.gouv.fr/commencer/demande-d-ajout-a-la-liste-des-administrations">
          faire une demande d’ajout
        </a>{" "}
        de votre organisation à la liste.
      </p>
      <p>
        Si votre demande est acceptée, vous obtiendrez automatiquement l’accès à
        l’espace agent.
      </p>
      <Link to="/">← Retourner au moteur de recherche</Link>
    </ConnexionSubLayout>
  );
}
