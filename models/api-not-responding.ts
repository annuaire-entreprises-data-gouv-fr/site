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
