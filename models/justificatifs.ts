import { IUniteLegale } from '.';
import { verifySiren } from '../utils/helpers/siren-and-siret';
import { IAPINotRespondingError } from './api-not-responding';
import { getUniteLegaleFromSlug } from './unite-legale';
import {
  getImmatriculationRNM,
  IImmatriculationRNM,
} from './immatriculation/rnm';
import {
  getImmatriculationJOAFE,
  IImmatriculationJOAFE,
} from './immatriculation/joafe';
import getImmatriculationRNCS, {
  IImmatriculationRNCS,
} from './immatriculation/rncs';

export interface IJustificatifs {
  uniteLegale: IUniteLegale;
  immatriculationRNM: IImmatriculationRNM | IAPINotRespondingError;
  immatriculationRNCS: IImmatriculationRNCS | IAPINotRespondingError;
  immatriculationJOAFE: IImmatriculationJOAFE | IAPINotRespondingError;
}

const getJustificatifs = async (slug: string) => {
  const siren = verifySiren(slug);

  const [uniteLegale, immatriculationRNM, immatriculationRNCS] =
    await Promise.all([
      getUniteLegaleFromSlug(siren, {}),
      getImmatriculationRNM(siren),
      getImmatriculationRNCS(siren),
    ]);

  const immatriculationJOAFE = await getImmatriculationJOAFE(
    siren,
    uniteLegale.association?.id || null
  );

  return {
    uniteLegale,
    immatriculationRNM,
    immatriculationRNCS,
    immatriculationJOAFE,
  };
};

export default getJustificatifs;
