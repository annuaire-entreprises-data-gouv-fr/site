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
  immatriculationRNM: IImmatriculationRNM & IAPINotRespondingError;
  immatriculationRNCS: IImmatriculationRNCS & IAPINotRespondingError;
}

const getJustificatifs = async (slug: string) => {
  const siren = verifySiren(slug);

  const uniteLegale = await getUniteLegaleFromSlug(siren);

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
