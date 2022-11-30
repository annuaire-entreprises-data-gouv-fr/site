import { IUniteLegale } from '.';
import { verifySiren } from '../utils/helpers/siren-and-siret';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from './api-not-responding';
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
import { isAssociation } from '.';
import { EAdministration } from './administrations';

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

  const immatriculationJOAFE = isAssociation(uniteLegale)
    ? await getImmatriculationJOAFE(
        siren,
        uniteLegale.association.idAssociation
      )
    : APINotRespondingFactory(EAdministration.DILA, 404);

  return {
    uniteLegale,
    immatriculationRNM,
    immatriculationRNCS,
    immatriculationJOAFE,
  };
};

export default getJustificatifs;
