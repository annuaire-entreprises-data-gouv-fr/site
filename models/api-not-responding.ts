import { EAdministration } from './administration';
import { IImmatriculation } from './immatriculation';

export interface IAPINotRespondingError {
  administration: EAdministration;
  type: 404 | 500;
}

export const isAPINotRespondingError = (
  toBeDetermined: IImmatriculation | IAPINotRespondingError
): toBeDetermined is IAPINotRespondingError => {
  if ((toBeDetermined as IAPINotRespondingError).administration) {
    return true;
  }
  return false;
};
