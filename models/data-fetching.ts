import {
  IAPINotRespondingError,
  isAPINotResponding,
} from './api-not-responding';

export enum IDataFetchingState {
  LOADING = '__DATAFETCHINGSTATE__LOADING__',
  /** Error that occurs client-side */
  UNAUTHORIZED = '__DATAFETCHINGSTATE__UNAUTHORIZED__',
  /** Error that occurs client-side */
  CONNECTIVITY_ERROR = '__DATAFETCHINGSTATE__CONNECTIVITY_ERROR__',
  /** Error that occurs server-side */
  MODEL_ERROR = '__DATAFETCHINGSTATE__MODEL_ERROR__',
}

export function isDataLoading<T>(
  toBeDetermined: T | IDataFetchingState
): toBeDetermined is IDataFetchingState.LOADING {
  return toBeDetermined === IDataFetchingState.LOADING;
}

export function hasFetchError<T>(
  toBeDetermined: T | IDataFetchingState
): toBeDetermined is
  | IDataFetchingState.CONNECTIVITY_ERROR
  | IDataFetchingState.MODEL_ERROR {
  return (
    toBeDetermined === IDataFetchingState.CONNECTIVITY_ERROR ||
    toBeDetermined === IDataFetchingState.MODEL_ERROR
  );
}

export function isUnauthorized<T>(
  toBeDetermined: T | IDataFetchingState
): toBeDetermined is IDataFetchingState.UNAUTHORIZED {
  return toBeDetermined === IDataFetchingState.UNAUTHORIZED;
}

export function hasAnyError<T>(
  toBeDetermined: T | IDataFetchingState | IAPINotRespondingError
): toBeDetermined is
  | IDataFetchingState.CONNECTIVITY_ERROR
  | IDataFetchingState.MODEL_ERROR
  | IAPINotRespondingError
  | IDataFetchingState.UNAUTHORIZED {
  return (
    !isDataLoading(toBeDetermined) &&
    (hasFetchError(toBeDetermined) ||
      isUnauthorized(toBeDetermined) ||
      isAPINotResponding(toBeDetermined))
  );
}
