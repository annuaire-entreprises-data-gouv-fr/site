import type {
  InferInputOrDefault,
  StandardSchemaV1,
} from "next-safe-action/dist/index.types-BAk5ylmT.mjs";
import { type HookSafeActionFn, useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import type { ServerActionError } from "server-actions/safe-action";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { IDataFetchingState } from "#models/data-fetching";
import { convertErrorToFetchingState } from "#utils/helpers/convert-error";

/**
 * Hook to fetch data from internal API
 * @param action : server action to execute
 * @param session : user session, used to check rights
 * @param input : input for the action
 * @param requiredRight : ApplicationRights required to execute the action
 * @returns {IDataFetchingState | Data} - The API loading state or the fetched data
 */
export function useServerActionData<S extends StandardSchemaV1, CVE, Data>(
  action: HookSafeActionFn<ServerActionError, S, CVE, Data>,
  session: ISession | null,
  input: InferInputOrDefault<S, void>,
  requiredRight: ApplicationRights = ApplicationRights.opendata
): Data | IDataFetchingState {
  const { execute, isPending, result, isIdle, hasErrored } = useAction(action);

  useEffect(() => {
    execute(input);
  }, [input]);

  if (!hasRights(session, requiredRight)) {
    return IDataFetchingState.UNAUTHORIZED;
  }

  if (isPending || isIdle) {
    return IDataFetchingState.LOADING;
  }

  if (hasErrored) {
    return convertErrorToFetchingState(result.serverError?.status ?? null);
  }

  return result.data as Data;
}
