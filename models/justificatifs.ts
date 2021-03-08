import { IUniteLegale, NotASirenError } from '.';
import { isSiren } from '../utils/helpers/siren-and-siret';
import { IAPINotRespondingError } from './api-not-responding';
import getConventionCollectives, {
  IConventionCollective,
} from './convention-collective';
import {
  IImmatriculationRNM,
  IImmatriculationRNCS,
  getImmatriculationRNM,
  getImmatriculationRNCS,
} from './immatriculation';
import getUniteLegale from './unite-legale';

export interface IJustificatifs {
  uniteLegale: IUniteLegale;
  conventionCollectives: IConventionCollective[];
  immatriculationRNM: IImmatriculationRNM | IAPINotRespondingError;
  immatriculationRNCS: IImmatriculationRNCS | IAPINotRespondingError;
}

const getJustificatifs = async (siren: string): Promise<IJustificatifs> => {
  if (!isSiren(siren)) {
    throw new NotASirenError();
  }
  const uniteLegale = await getUniteLegale(siren as string);

  const justificatifs = await Promise.all([
    getConventionCollectives(uniteLegale as IUniteLegale),
    getImmatriculationRNM(siren),
    getImmatriculationRNCS(siren),
  ]);

  return {
    uniteLegale,
    conventionCollectives: justificatifs[0],
    immatriculationRNM: justificatifs[1],
    immatriculationRNCS: justificatifs[2],
  };
};

export default getJustificatifs;
