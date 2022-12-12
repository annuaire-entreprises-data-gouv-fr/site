import { IAPINotRespondingError } from '#models/api-not-responding';
import getImmatriculationRNCS, {
  IImmatriculationRNCS,
} from '#models/immatriculation/rncs';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { verifySiren } from '#utils/helpers';
import { IUniteLegale } from '.';

export interface IDirigeants {
  uniteLegale: IUniteLegale;
  immatriculationRNCS: IImmatriculationRNCS | IAPINotRespondingError;
}

export const getDirigeantsWithUniteLegaleFromSlug = async (
  slug: string
): Promise<IDirigeants> => {
  const siren = verifySiren(slug);
  const [uniteLegale, immatriculationRNCS] = await Promise.all([
    getUniteLegaleFromSlug(siren, {}),
    getImmatriculationRNCS(siren),
  ]);

  return {
    uniteLegale,
    immatriculationRNCS,
  };
};
