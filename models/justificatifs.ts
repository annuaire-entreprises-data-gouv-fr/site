import { IUniteLegale } from '.';
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

const getJustificatifs = async (slug: string): Promise<IJustificatifs> => {
  const uniteLegale = await getUniteLegale(slug);

  const justificatifs = await Promise.all([
    getImmatriculationRNM(uniteLegale.siren),
    getImmatriculationRNCS(uniteLegale.siren),
  ]);

  return {
    uniteLegale,
    immatriculationRNM: justificatifs[0],
    immatriculationRNCS: justificatifs[1],
  };
};

export default getJustificatifs;
