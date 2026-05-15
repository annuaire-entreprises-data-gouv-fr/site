import { createFileRoute } from "@tanstack/react-router";
import { Link } from "#/components/Link";
import ChangelogWithFilters from "#/components/screens/historique-des-modifications";
import FAQLink from "#/components-ui/faq-link";
import { useAuth } from "#/contexts/auth.context";
import { meta } from "#/seo";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute(
  "/_header-default/historique-des-modifications"
)({
  head: () => {
    const canonical =
      "https://annuaire-entreprises.data.gouv.fr/historique-des-modifications";
    return {
      meta: meta({
        title: "Historique des changements",
        robots: "noindex, follow",
        alternates: {
          canonical,
        },
      }),
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
});

function RouteComponent() {
  const { user } = useAuth();

  return (
    <>
      <h1>Quoi de neuf sur l’Annuaire des Entreprises ?</h1>
      <p>
        Retrouvez les nouveautés du{" "}
        <FAQLink tooltipLabel="Site public">
          Ensemble des pages accessibles à tous les internautes, gratuitement et
          sans création de compte
        </FAQLink>
        , de l’
        <Link to="/lp/agent-public">Espace agent public</Link> et de l'
        <Link to="/donnees/api-entreprises">
          API de Recherche d'Entreprises
        </Link>
        .
      </p>
      <ChangelogWithFilters user={user} />
    </>
  );
}
