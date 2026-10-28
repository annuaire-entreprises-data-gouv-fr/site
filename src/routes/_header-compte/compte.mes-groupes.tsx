import {
  createFileRoute,
  useLoaderData,
  useRouter,
} from "@tanstack/react-router";
import AgentNavigation from "#/components/espace-agent-components/agent-navigation";
import { GroupManagement } from "#/components/espace-agent-components/group-management";
import { GroupsListPageSkeleton } from "#/components/espace-agent-components/skeleton";
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
  component: RouteComponent,
  pendingMs: 100,
  pendingMinMs: 300,
  pendingComponent: GroupsListPageSkeleton,
  errorComponent: HeaderCompteError,
});

function RouteComponent() {
  const { groups } = useLoaderData({ from: "/_header-compte" });
  const router = useRouter();

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
      <GroupManagement
        groups={groups}
        onGroupChange={() => router.invalidate()}
      />
    </>
  );
}
