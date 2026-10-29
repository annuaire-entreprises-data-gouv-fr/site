import { queryOptions } from "@tanstack/react-query";
import { getAgentGroupFn } from "#/server-functions/agent/group-management";

export const agentGroupQueryKey = (groupId: number) => ["agent-group", groupId];

/**
 * A group with one page of its members, filtered by email when searching
 */
export const agentGroupQueryOptions = (
  groupId: number,
  usersPage: number,
  usersSearch: string
) =>
  queryOptions({
    queryKey: [...agentGroupQueryKey(groupId), usersPage, usersSearch],
    queryFn: () =>
      getAgentGroupFn({
        data: { groupId, usersPage, usersSearch: usersSearch || undefined },
      }),
    staleTime: 30_000,
  });
