import { EAdministration } from './administration';

export interface IAPINotRespondingError {
  administration: EAdministration;
  errorType: 404 | 500 | number;
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

export const isAPINotResponding = (
  toBeDetermined: any | IAPINotRespondingError
): toBeDetermined is IAPINotRespondingError => {
  if ((toBeDetermined as IAPINotRespondingError).errorType) {
    return true;
  }
  return false;
};
