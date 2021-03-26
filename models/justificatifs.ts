import { IUniteLegale, NotASirenError } from '.';
import { isSiren } from '../utils/helpers/siren-and-siret';
import { IAPINotRespondingError } from './api-not-responding';
import {
  IImmatriculationRNM,
  IImmatriculationRNCS,
  getImmatriculationRNM,
  getImmatriculationRNCS,
} from './immatriculation';
import getUniteLegale from './unite-legale';

export interface IJustificatifs {
  uniteLegale: IUniteLegale;
  immatriculationRNM: IImmatriculationRNM | IAPINotRespondingError;
  immatriculationRNCS: IImmatriculationRNCS | IAPINotRespondingError;
}

const getJustificatifs = async (siren: string): Promise<IJustificatifs> => {
  if (!isSiren(siren)) {
    throw new NotASirenError();
  }

  const uniteLegale = await getUniteLegale(siren as string);

  const justificatifs = await Promise.all([
    getImmatriculationRNM(siren),
    getImmatriculationRNCS(siren),
  ]);

  return {
    uniteLegale,
    immatriculationRNM: justificatifs[0],
    immatriculationRNCS: justificatifs[1],
  };
};

export default getJustificatifs;
