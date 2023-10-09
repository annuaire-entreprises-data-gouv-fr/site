export interface IAPILoading {
  __API_LOADING__: true;
}

const API_LOADING = 'API_LOADING';

export function isAPILoading<T>(
  toBeDetermined: T | IAPILoading
): toBeDetermined is IAPILoading {
  return toBeDetermined === API_LOADING;
}

export function APILoadingFactory(): IAPILoading {
  return API_LOADING as unknown as IAPILoading;
}
