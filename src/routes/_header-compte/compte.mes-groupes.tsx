import { createFileRoute } from "@tanstack/react-router";
import AgentNavigation from "#/components/espace-agent-components/agent-navigation";
import { GroupManagement } from "#/components/espace-agent-components/group-management";
import {
  getAgentGroupsFn,
  getAgentRolesFn,
} from "#/server-functions/agent/group-management";
import { agentAuthGuardFn } from "#/server-functions/public/auth";
import { pluralize } from "#/utils/helpers";
import { meta } from "#/utils/seo";
import { HeaderCompteError } from "./-error";

export const Route = createFileRoute("/_header-compte/compte/mes-groupes")({
  head: () => {
    const canonical = "https://annuaire-entreprises.data.gouv.fr/mes-groupes";
    return {
      meta: meta({
        title: "Vos groupes au sein de l’Annuaire des Entreprises",
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
  beforeLoad: async () => {
    await agentAuthGuardFn({ data: { onlySuperAgent: true } });
  },
  loader: async () => {
    const [roles, groups] = await Promise.all([
      getAgentRolesFn(),
      getAgentGroupsFn(),
    ]);

    return { roles, groups };
  },
  component: RouteComponent,
  errorComponent: HeaderCompteError,
});

function RouteComponent() {
  const { roles, groups } = Route.useLoaderData();

  return (
    <>
      <AgentNavigation />
      <h1>Mes groupes</h1>

      <p>
        <br />
        Seuls les administrateurs d’un groupe peuvent le modifier (renommer,
        ajouter ou supprimer un membre, ou changer son rôle).
        <br />
        <br />
        Vous faites partie de {groups.length} groupe{pluralize(groups)} :
      </p>
      <GroupManagement initialGroups={groups} roles={roles} />
    </>
  );
}
