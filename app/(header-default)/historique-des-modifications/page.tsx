import type { Metadata } from "next";
import { Link } from "#components/Link";
import FAQLink from "#components-ui/faq-link";
import getSession from "#utils/server-side-helper/get-session";
import ChangelogWithFilters from "./_components";

export const metadata: Metadata = {
  title: "Historique des changements",
  alternates: {
    canonical:
      "https://annuaire-entreprises.data.gouv.fr/historique-des-modifications",
  },
  robots: "noindex, follow",
};

export default async function ChangelogPage() {
  const session = await getSession();
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
        <Link href="/lp/agent-public">Espace agent public</Link> et de l'
        <Link href="/donnees/api-entreprises">
          API de Recherche d'Entreprises
        </Link>
        .
      </p>
      <ChangelogWithFilters session={session} />
    </>
  );
}
