import {
  createFileRoute,
  notFound,
  redirect,
  useLoaderData,
  useRouter,
} from "@tanstack/react-router";
import z from "zod";
import AgentNavigation from "#/components/espace-agent-components/agent-navigation";
import { GroupDetails } from "#/components/espace-agent-components/group-management/group-details";
import { GroupDetailsPageSkeleton } from "#/components/espace-agent-components/skeleton";
import {
  getAgentGroupFn,
  getAgentRolesFn,
} from "#/server-functions/agent/group-management";
import { agentAuthGuardFn } from "#/server-functions/public/auth";
import { meta } from "#/utils/seo";
import { HeaderCompteError } from "./-error";

export const Route = createFileRoute(
  "/_header-compte/compte/mes-groupes_/$groupId"
)({
  validateSearch: z.object({
    page: z.number().int().positive().optional().catch(undefined),
  }),
  head: () => ({
    meta: meta({
      title: "Votre groupe au sein de l’Annuaire des Entreprises",
      robots: "noindex, nofollow",
    }),
  }),
  beforeLoad: async () => {
    await agentAuthGuardFn({ data: { onlySuperAgent: true } });
  },
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: async ({ params, deps }) => {
    const groupId = Number(params.groupId);
    if (!Number.isInteger(groupId) || groupId <= 0) {
      throw notFound();
    }

    const [roles, group] = await Promise.all([
      getAgentRolesFn(),
      getAgentGroupFn({ data: { groupId, usersPage: deps.page } }),
    ]);

    const { totalPages } = group.usersPagination;
    if (totalPages > 0 && deps.page > totalPages) {
      throw redirect({
        href: `/compte/mes-groupes/${groupId}?page=${totalPages}`,
      });
    }

    return { roles, group };
  },
  component: RouteComponent,
  pendingMs: 100,
  pendingMinMs: 300,
  pendingComponent: GroupDetailsPageSkeleton,
  errorComponent: HeaderCompteError,
});

function RouteComponent() {
  const { roles, group } = Route.useLoaderData();
  const { groups } = useLoaderData({ from: "/_header-compte" });
  const navigate = Route.useNavigate();
  const router = useRouter();

  return (
    <>
      <AgentNavigation />
      {/* with a single group, the groups list redirects to this page */}
      {groups.length > 1 && (
        <nav aria-label="vous êtes ici :" className="fr-breadcrumb fr-mb-0">
          <ol className="fr-breadcrumb__list">
            <li>
              <a className="fr-breadcrumb__link" href="/compte/mes-groupes">
                Mes groupes
              </a>
            </li>
            <li>
              <a
                aria-current="page"
                className="fr-breadcrumb__link"
                href={`/compte/mes-groupes/${group.id}`}
              >
                {group.name}
              </a>
            </li>
          </ol>
        </nav>
      )}
      <GroupDetails
        group={group}
        onGroupChange={() => router.invalidate()}
        onLeaveGroup={() =>
          // Full reload: reloading this page would fail as the user is no
          // longer a member, and the cached groups still hold this group, which
          // the groups list could redirect to
          navigate({ to: "/compte/mes-groupes", reloadDocument: true })
        }
        onPageChange={(page) =>
          navigate({ search: (prev) => ({ ...prev, page }) })
        }
        roles={roles}
      />
    </>
  );
}
