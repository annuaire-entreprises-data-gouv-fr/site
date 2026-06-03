import {
  type IAPINotRespondingError,
  isAPINotResponding,
} from "./api-not-responding";

export const IDataFetchingState = {
  LOADING: "__DATAFETCHINGSTATE__LOADING__",
  /** Error that occurs client-side */
  UNAUTHORIZED: "__DATAFETCHINGSTATE__UNAUTHORIZED__",
  /** Error that occurs client-side */
  TOO_MANY_REQUESTS: "__DATAFETCHINGSTATE__TOO_MANY_REQUESTS__",
  /** Error that occurs client-side */
  AGENT_OVER_RATE_LIMITS: "__DATAFETCHINGSTATE__AGENT_OVER_RATE_LIMITS__",
  /** Error that occurs client-side */
  CONNECTIVITY_ERROR: "__DATAFETCHINGSTATE__CONNECTIVITY_ERROR__",
  /** Error that occurs server-side */
  MODEL_ERROR: "__DATAFETCHINGSTATE__MODEL_ERROR__",
} as const;
export type IDataFetchingState =
  (typeof IDataFetchingState)[keyof typeof IDataFetchingState];

export function isDataLoading<T>(
  toBeDetermined: T | IDataFetchingState
): toBeDetermined is typeof IDataFetchingState.LOADING {
  return toBeDetermined === IDataFetchingState.LOADING;
}

export function hasFetchError<T>(
  toBeDetermined: T | IDataFetchingState
): toBeDetermined is
  | typeof IDataFetchingState.CONNECTIVITY_ERROR
  | typeof IDataFetchingState.TOO_MANY_REQUESTS
  | typeof IDataFetchingState.AGENT_OVER_RATE_LIMITS
  | typeof IDataFetchingState.MODEL_ERROR {
  return (
    toBeDetermined === IDataFetchingState.CONNECTIVITY_ERROR ||
    toBeDetermined === IDataFetchingState.TOO_MANY_REQUESTS ||
    toBeDetermined === IDataFetchingState.AGENT_OVER_RATE_LIMITS ||
    toBeDetermined === IDataFetchingState.MODEL_ERROR
  );
}

export function isUnauthorized<T>(
  toBeDetermined: T | IDataFetchingState
): toBeDetermined is typeof IDataFetchingState.UNAUTHORIZED {
  return toBeDetermined === IDataFetchingState.UNAUTHORIZED;
}

export function hasAnyError<T>(
  toBeDetermined: T | IDataFetchingState | IAPINotRespondingError
): toBeDetermined is
  | typeof IDataFetchingState.CONNECTIVITY_ERROR
  | typeof IDataFetchingState.TOO_MANY_REQUESTS
  | typeof IDataFetchingState.AGENT_OVER_RATE_LIMITS
  | typeof IDataFetchingState.MODEL_ERROR
  | IAPINotRespondingError
  | typeof IDataFetchingState.UNAUTHORIZED {
  return (
    !isDataLoading(toBeDetermined) &&
    (hasFetchError(toBeDetermined) ||
      isUnauthorized(toBeDetermined) ||
      isAPINotResponding(toBeDetermined))
  );
}

/**
 * The data is authorized, not loading, no fetch error, no API error
 */
export function isDataSuccess<T>(
  toBeDetermined: T | IDataFetchingState | IAPINotRespondingError
): toBeDetermined is T {
  return !(isDataLoading(toBeDetermined) || hasAnyError(toBeDetermined));
}
