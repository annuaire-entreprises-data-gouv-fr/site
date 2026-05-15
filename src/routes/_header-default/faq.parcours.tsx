import { createFileRoute } from "@tanstack/react-router";
import ParcoursQuestions from "#/components/screens/faq.parcours/parcours-questions";
import { useAuth } from "#/contexts/auth.context";
import { meta } from "#/seo";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/_header-default/faq/parcours")({
  head: () => {
    const canonical = "https://annuaire-entreprises.data.gouv.fr/faq/parcours";
    return {
      meta: meta({
        title: "FAQ interactive de l’Annuaire des Entreprises",
        robots: "index, follow",
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
  errorComponent: HeaderDefaultError,
});

function RouteComponent() {
  const { user } = useAuth();

  return (
    <>
      <h1>Nous écrire</h1>
      <strong>Vous êtes :</strong>
      <ParcoursQuestions user={user} />
      <div style={{ marginTop: "200px" }} />
    </>
  );
}
