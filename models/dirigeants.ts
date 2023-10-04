import { IAPINotRespondingError } from '#models/api-not-responding';
import { IUniteLegale } from '.';
import { IAPILoading } from './api-loading';
import { IImmatriculationRNE } from './immatriculation';

export interface IDirigeants {
  uniteLegale: IUniteLegale;
  immatriculationRNE:
    | IImmatriculationRNE
    | IAPINotRespondingError
    | IAPILoading;
}
