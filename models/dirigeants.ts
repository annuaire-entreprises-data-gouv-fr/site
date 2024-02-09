import { IAPINotRespondingError } from '#models/api-not-responding';
import { IAPILoading } from './api-loading';
import { IImmatriculationRNE } from './immatriculation';
import { IUniteLegale } from './core/types';

export interface IDirigeants {
  uniteLegale: IUniteLegale;
  immatriculationRNE:
    | IImmatriculationRNE
    | IAPINotRespondingError
    | IAPILoading;
}
