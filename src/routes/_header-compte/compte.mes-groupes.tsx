import { createFileRoute } from "@tanstack/react-router";
import { meta } from "#/seo";
import { agentAuthGuardFn } from "#/server-functions/public/auth";
import { HeaderCompteError } from "./-error";

export const Route = createFileRoute("/_header-compte/compte/mes-groupes")({
  head: () => {
    const canonical = "https://annuaire-entreprises.data.gouv.fr/mes-groupes";
    return {
      meta: meta({
        title: "Vos groupes au sein de l’Annuaire des Entreprises",
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
  beforeLoad: async () => {
    await agentAuthGuardFn();
  },
  component: RouteComponent,
  errorComponent: HeaderCompteError,
});

function RouteComponent() {
  return <div>Hello "/_header-compte/compte/mes-groupes"!</div>;
}
