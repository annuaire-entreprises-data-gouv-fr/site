import { EAdministration } from './administrations';

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

export function isAPINotResponding<T>(
  toBeDetermined: Exclude<T, null> | IAPINotRespondingError
): toBeDetermined is IAPINotRespondingError {
  if ((toBeDetermined as IAPINotRespondingError).errorType) {
    return true;
  }
  return false;
}
