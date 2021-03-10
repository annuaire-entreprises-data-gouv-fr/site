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

export enum EAdministration {
  INPI = 'Institut National de la Propriété Intellectuelle (INPI)',
  INSEE = 'Institut national de la Statistique et des Études Économiques (INSEE)',
  CMAFRANCE = 'Chambre des Métiers et de l’Artisnat (CMA-France)',
}
