import { IUniteLegale } from '.';
import { verifySiren } from '../utils/helpers/siren-and-siret';
import { IAPINotRespondingError } from './api-not-responding';
import {
  IImmatriculationRNM,
  IImmatriculationRNCS,
  getImmatriculationRNM,
  getImmatriculationRNCS,
} from './immatriculation';
import { getUniteLegaleFromSlug } from './unite-legale';

export interface IJustificatifs {
  uniteLegale: IUniteLegale;
  immatriculationRNM: IImmatriculationRNM | IAPINotRespondingError;
  immatriculationRNCS: IImmatriculationRNCS | IAPINotRespondingError;
}

const getJustificatifs = async (slug: string) => {
  const siren = verifySiren(slug);

  const [uniteLegale, immatriculationRNM, immatriculationRNCS] =
    await Promise.all([
      getUniteLegaleFromSlug(siren),
      getImmatriculationRNM(siren),
      getImmatriculationRNCS(siren),
    ]);

  return {
    uniteLegale,
    immatriculationRNM,
    immatriculationRNCS,
  };
};

export default getJustificatifs;
