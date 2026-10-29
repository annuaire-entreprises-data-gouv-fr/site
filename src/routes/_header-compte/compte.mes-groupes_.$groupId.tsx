import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createFileRoute,
  notFound,
  redirect,
  useLoaderData,
  useRouter,
} from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import z from "zod";
import AgentNavigation from "#/components/espace-agent-components/agent-navigation";
import { GroupDetails } from "#/components/espace-agent-components/group-management/group-details";
import {
  agentGroupQueryKey,
  agentGroupQueryOptions,
} from "#/components/espace-agent-components/group-management/group-query";
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
    recherche: z.string().optional().catch(undefined),
  }),
  head: () => ({
    meta: meta({
      title: "Votre groupe au sein de l’Annuaire des Entreprises",
      robots: "noindex, nofollow",
    }),
  }),
  beforeLoad: async ({ cause, search }) => {
    // only the members page or search changed: still on the same page
    if (cause !== "stay") {
      await agentAuthGuardFn({ data: { onlySuperAgent: true } });
    }
    return {
      initialMembers: {
        page: search.page ?? 1,
        search: search.recherche ?? "",
      },
    };
  },
  // The members page and search are not loader deps: changing them does not
  // reload the route (showing its skeleton). RouteComponent fetches them while
  // keeping the current members displayed, so the loader only loads the page
  // when entering it.
  shouldReload: false,
  loader: async ({ params, context: { initialMembers } }) => {
    const groupId = Number(params.groupId);
    if (!Number.isInteger(groupId) || groupId <= 0) {
      throw notFound();
    }

    const [roles, group] = await Promise.all([
      getAgentRolesFn(),
      getAgentGroupFn({
        data: {
          groupId,
          usersPage: initialMembers.page,
          usersSearch: initialMembers.search || undefined,
        },
      }),
    ]);

    const { totalPages } = group.usersPagination;
    if (totalPages > 0 && initialMembers.page > totalPages) {
      const search = new URLSearchParams({ page: String(totalPages) });
      if (initialMembers.search) {
        search.set("recherche", initialMembers.search);
      }
      throw redirect({ href: `/compte/mes-groupes/${groupId}?${search}` });
    }

    return { roles, initialGroup: group, initialMembers, loadedAt: Date.now() };
  },
  component: RouteComponent,
  pendingMs: 100,
  pendingMinMs: 300,
  pendingComponent: GroupDetailsPageSkeleton,
  errorComponent: HeaderCompteError,
});

function RouteComponent() {
  const { roles, initialGroup, initialMembers, loadedAt } =
    Route.useLoaderData();
  const { groups } = useLoaderData({ from: "/_header-compte" });
  const { page = 1, recherche = "" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isInitialMembers =
    page === initialMembers.page && recherche === initialMembers.search;
  const groupQuery = useQuery({
    ...agentGroupQueryOptions(initialGroup.id, page, recherche),
    // loaded by the route, including during SSR
    initialData: isInitialMembers ? initialGroup : undefined,
    initialDataUpdatedAt: loadedAt,
    // keep the current members displayed while the next ones load
    placeholderData: keepPreviousData,
  });
  const group = groupQuery.data ?? initialGroup;
  const { totalPages } = group.usersPagination;

  // stable, as the search input debounces on it
  const onSearchChange = useCallback(
    (newSearch: string) =>
      navigate({
        search: (prev) => ({
          ...prev,
          recherche: newSearch || undefined,
          page: undefined,
        }),
        replace: true,
        resetScroll: false,
      }),
    [navigate]
  );

  // e.g. the only member of the last page has been removed
  useEffect(() => {
    if (!groupQuery.isPlaceholderData && totalPages > 0 && page > totalPages) {
      navigate({
        search: (prev) => ({ ...prev, page: totalPages }),
        replace: true,
      });
    }
  }, [groupQuery.isPlaceholderData, totalPages, page, navigate]);

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
        hasMembersError={groupQuery.isError}
        isLoadingMembers={groupQuery.isPlaceholderData}
        onGroupChange={() =>
          Promise.all([
            queryClient.invalidateQueries({
              queryKey: agentGroupQueryKey(group.id),
            }),
            // the groups list shows the group name and admins
            router.invalidate({
              filter: (match) => match.routeId === "/_header-compte",
            }),
          ])
        }
        onLeaveGroup={() =>
          // Full reload: reloading this page would fail as the user is no
          // longer a member, and the cached groups still hold this group, which
          // the groups list could redirect to
          navigate({ to: "/compte/mes-groupes", reloadDocument: true })
        }
        onPageChange={(newPage) =>
          navigate({ search: (prev) => ({ ...prev, page: newPage }) })
        }
        onSearchChange={onSearchChange}
        roles={roles}
        search={recherche}
      />
    </>
  );
}
