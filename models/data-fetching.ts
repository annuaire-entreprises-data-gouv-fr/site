import {
  IAPINotRespondingError,
  isAPINotResponding,
} from './api-not-responding';

export enum IDataFetchingState {
  LOADING = '__DATAFETCHINGSTATE__LOADING__',
  UNAUTHORIZED = '__DATAFETCHINGSTATE__UNAUTHORIZED__',
  ERROR = '__DATAFETCHINGSTATE__ERROR__',
}

export function isDataLoading<T>(
  toBeDetermined: T | IDataFetchingState
): toBeDetermined is IDataFetchingState.LOADING {
  return toBeDetermined === IDataFetchingState.LOADING;
}

export function hasFetchError<T>(
  toBeDetermined: T | IDataFetchingState
): toBeDetermined is IDataFetchingState.ERROR {
  return toBeDetermined === IDataFetchingState.ERROR;
}

export function isUnauthorized<T>(
  toBeDetermined: T | IDataFetchingState
): toBeDetermined is IDataFetchingState.UNAUTHORIZED {
  return toBeDetermined === IDataFetchingState.UNAUTHORIZED;
}

export function hasAnyError<T>(
  toBeDetermined: T | IDataFetchingState | IAPINotRespondingError
): toBeDetermined is
  | IDataFetchingState.ERROR
  | IAPINotRespondingError
  | IDataFetchingState.UNAUTHORIZED {
  return (
    !isDataLoading(toBeDetermined) &&
    (hasFetchError(toBeDetermined) ||
      isUnauthorized(toBeDetermined) ||
      isAPINotResponding(toBeDetermined))
  );
}
