import { IAPINotRespondingError } from '#models/api-not-responding';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { verifySiren } from '#utils/helpers';
import { IUniteLegale } from '.';
import { IImmatriculationRNE } from './immatriculation';
import getImmatriculationRNE from './immatriculation/rne';

export interface IDirigeants {
  uniteLegale: IUniteLegale;
  immatriculationRNE: IImmatriculationRNE | IAPINotRespondingError;
}

export const getDirigeantsWithUniteLegaleFromSlug = async (
  slug: string
): Promise<IDirigeants> => {
  const siren = verifySiren(slug);
  const [uniteLegale, immatriculationRNE] = await Promise.all([
    getUniteLegaleFromSlug(siren, {}),
    getImmatriculationRNE(siren),
  ]);

  return {
    uniteLegale,
    immatriculationRNE,
  };
};
