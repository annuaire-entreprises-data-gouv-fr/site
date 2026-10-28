import {
  createFileRoute,
  notFound,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import z from "zod";
import AgentNavigation from "#/components/espace-agent-components/agent-navigation";
import { GroupDetails } from "#/components/espace-agent-components/group-management/group-details";
import {
  getAgentGroupFn,
  getAgentGroupsFn,
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

    const [roles, groups, group] = await Promise.all([
      getAgentRolesFn(),
      getAgentGroupsFn(),
      getAgentGroupFn({ data: { groupId, usersPage: deps.page } }),
    ]);

    // the groups list holds the current user role and the group admins
    const groupSummary = groups.find((g) => g.id === groupId);
    if (!groupSummary) {
      throw notFound();
    }

    const { totalPages } = group.usersPagination;
    if (totalPages > 0 && deps.page > totalPages) {
      throw redirect({
        href: `/compte/mes-groupes/${groupId}?page=${totalPages}`,
      });
    }

    return {
      roles,
      group,
      isAdmin: groupSummary.current_user_role.is_admin,
      adminCount: groupSummary.admins.length,
    };
  },
  component: RouteComponent,
  errorComponent: HeaderCompteError,
});

function RouteComponent() {
  const { roles, group, isAdmin, adminCount } = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const router = useRouter();

  return (
    <>
      <AgentNavigation />
      <nav aria-label="vous êtes ici :" className="fr-breadcrumb">
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
      <GroupDetails
        adminCount={adminCount}
        group={group}
        isAdmin={isAdmin}
        onGroupChange={() => router.invalidate()}
        onLeaveGroup={() => navigate({ to: "/compte/mes-groupes" })}
        onPageChange={(page) =>
          navigate({ search: (prev) => ({ ...prev, page }) })
        }
        roles={roles}
      />
    </>
  );
}
