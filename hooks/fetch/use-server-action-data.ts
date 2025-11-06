import type { APIRoutesHandlers } from "app/api/data-fetching/routes-handlers";
import type { APIRoutesPaths } from "app/api/data-fetching/routes-paths";
import type {
  InferInputOrDefault,
  StandardSchemaV1,
} from "next-safe-action/dist/index.types-BAk5ylmT.mjs";
import { type HookSafeActionFn, useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import type { ServerActionError } from "server-actions/safe-action";
import type { UnwrapPromise } from "types";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { IDataFetchingState } from "#models/data-fetching";

export type RouteResponse<T> = T extends APIRoutesPaths
  ? UnwrapPromise<ReturnType<(typeof APIRoutesHandlers)[T]>>
  : never;

export type RouteParams<T> = T extends APIRoutesPaths
  ? Parameters<(typeof APIRoutesHandlers)[T]>[1]
  : never;

type Options<T extends APIRoutesPaths> = {
  params?: RouteParams<T>;
};

/**
 * Hook to fetch data from internal API
 * @param action : server action to execute
 * @param session : user session, used to check rights
 * @param input : input for the action
 * @param requiredRight : ApplicationRights required to execute the action
 * @returns {IDataFetchingState | RouteResponse<T>} - The API loading state or the fetched data
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
    if (
      result.serverError?.status &&
      [408, 504, 401].includes(result.serverError.status)
    ) {
      return IDataFetchingState.CONNECTIVITY_ERROR;
    }

    if (result.serverError?.status === 432) {
      return IDataFetchingState.AGENT_OVER_RATE_LIMITS;
    }

    if (result.serverError?.status === 429) {
      return IDataFetchingState.TOO_MANY_REQUESTS;
    }

    return IDataFetchingState.MODEL_ERROR;
  }

  return result.data as Data;
}
