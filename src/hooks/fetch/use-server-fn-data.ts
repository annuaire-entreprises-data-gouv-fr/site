import { useQuery } from "@tanstack/react-query";
import {
  type IntersectAllValidatorInputs,
  type RequiredFetcher,
  useServerFn,
} from "@tanstack/react-start";
import type { Expand } from "node_modules/@tanstack/react-router/dist/cjs/index.d.cts";
import { useAuth } from "#/contexts/auth.context";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { IDataFetchingState } from "#/models/data-fetching";
import type { ServerActionError } from "#/server-functions/middlewares";
import { convertErrorToFetchingState } from "#/utils/helpers/convert-error";

/**
 * Hook to fetch data from internal API
 * @param action : server action to execute
 * @param session : user session, used to check rights
 * @param input : input for the action
 * @param requiredRight : ApplicationRights required to execute the action
 * @returns {IDataFetchingState | Data} - The API loading state or the fetched data
 */
export function useServerFnData<Input, Data>(
  action: RequiredFetcher<unknown, Input, Data>,
  input: Expand<IntersectAllValidatorInputs<unknown, Input>>,
  requiredRight: ApplicationRights = ApplicationRights.opendata
): Awaited<Data> | IDataFetchingState {
  const { user } = useAuth();
  const execute = useServerFn(action);

  const { data, isPending, isLoading, isError, error } = useQuery({
    queryKey: ["server-function", action.url, input],
    queryFn: () => execute({ data: input }),
    enabled: hasRights({ user }, requiredRight),
  });

  if (!hasRights({ user }, requiredRight)) {
    return IDataFetchingState.UNAUTHORIZED;
  }

  if (isPending || isLoading) {
    return IDataFetchingState.LOADING;
  }

  if (isError) {
    return convertErrorToFetchingState(
      (error as unknown as ServerActionError | undefined)?.status ?? null
    );
  }

  return data as Awaited<Data>;
}
