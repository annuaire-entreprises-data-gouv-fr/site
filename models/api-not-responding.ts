import { EAdministration } from './administrations/EAdministration';
import { IDataFetchingState } from './data-fetching';

export interface IAPINotRespondingError {
  administration: EAdministration;
  errorType: 404 | 500 | 400 | number;
}

export const APINotRespondingFactory = (
  administration: EAdministration,
  errorType = 500
): IAPINotRespondingError => {
  return {
    administration,
    errorType,
  };
};

export function isAPINotResponding<
  T extends Exclude<unknown, IDataFetchingState>
>(
  toBeDetermined: T | IAPINotRespondingError
): toBeDetermined is IAPINotRespondingError {
  if ((toBeDetermined as IAPINotRespondingError)?.errorType) {
    return true;
  }
  return false;
}

export function isAPI404<T extends Exclude<unknown, IDataFetchingState>>(
  toBeDetermined: T | IAPINotRespondingError
): toBeDetermined is IAPINotRespondingError {
  if (
    (toBeDetermined as IAPINotRespondingError)?.errorType &&
    (toBeDetermined as IAPINotRespondingError)?.errorType === 404
  ) {
    return true;
  }
  return false;
}
