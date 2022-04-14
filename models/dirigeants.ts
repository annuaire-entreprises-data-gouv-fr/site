import { IUniteLegale } from '.';
import { verifySiren } from '../utils/helpers/siren-and-siret';
import { IAPINotRespondingError } from './api-not-responding';
import getImmatriculationRNCS, {
  IImmatriculationRNCS,
} from './immatriculation/rncs';
import { getUniteLegaleFromSlug } from './unite-legale';

export interface IDirigeants {
  uniteLegale: IUniteLegale;
  immatriculationRNCS: IImmatriculationRNCS | IAPINotRespondingError;
}

export const getDirigeantsWithUniteLegaleFromSlug = async (
  slug: string
): Promise<IDirigeants> => {
  const siren = verifySiren(slug);
  const [uniteLegale, immatriculationRNCS] = await Promise.all([
    getUniteLegaleFromSlug(siren),
    getImmatriculationRNCS(siren),
  ]);

  return {
    uniteLegale,
    immatriculationRNCS,
  };
};
