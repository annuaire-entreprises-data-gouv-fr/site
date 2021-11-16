import { IUniteLegale } from '.';
import { verifySiren } from '../utils/helpers/siren-and-siret';
import { EAdministration } from './administration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from './api-not-responding';
import {
  IImmatriculationRNM,
  IImmatriculationRNCS,
  IImmatriculationJOAFE,
  getImmatriculationJOAFE,
  getImmatriculationRNM,
  getImmatriculationRNCS,
} from './immatriculation';
import { getUniteLegaleFromSlug } from './unite-legale';

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
      getUniteLegaleFromSlug(siren),
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
