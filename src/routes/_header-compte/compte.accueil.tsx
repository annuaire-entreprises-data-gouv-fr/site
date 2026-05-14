import { createFileRoute } from "@tanstack/react-router";
import AgentNavigation from "#/components/espace-agent-components/agent-navigation";
import { CardHabilitation } from "#/components/espace-agent-components/card-habilitation";
import { HabilitationsTable } from "#/components/espace-agent-components/habilitations-table";
import { useAuth } from "#/contexts/auth.context";
import { getAgentFullName } from "#/models/authentication/user/helpers";
import { meta } from "#/seo";
import { getAgentGroupsFn } from "#/server-functions/agent/group-management";
import { agentAuthGuardFn } from "#/server-functions/public/auth";
import { HeaderCompteError } from "./-error";

export const Route = createFileRoute("/_header-compte/compte/accueil")({
  head: () => {
    const canonical =
      "https://annuaire-entreprises.data.gouv.fr/compte/accueil";
    return {
      meta: meta({
        title: "Votre compte utilisateur de l’Annuaire des Entreprises",
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
  loader: async () => {
    const groups = await getAgentGroupsFn();

    return { groups };
  },
  component: RouteComponent,
  errorComponent: HeaderCompteError,
});

function RouteComponent() {
  const { groups } = Route.useLoaderData();

  const { user } = useAuth();

  const habilitationUrl = `${import.meta.env.VITE_DATAPASS_URL}/demandes/annuaire-des-entreprises/nouveau`;

  if (!user) {
    return null;
  }

  return (
    <>
      <AgentNavigation />
      <section className="fr-grid-row fr-mt-5w">
        <div className="fr-col-md-7 fr-col-12">
          <h1 className="fr-h1 fr-mt-0">
            Bonjour {getAgentFullName({ user })},
          </h1>
          <HabilitationsTable groups={groups} />
        </div>
        <div className="fr-col-md-1 fr-col-12" />
        <div className="fr-col-md-4 fr-col-12">
          <CardHabilitation groups={groups} habilitationUrl={habilitationUrl} />
        </div>
      </section>
    </>
  );
}
