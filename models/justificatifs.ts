import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import {
  getImmatriculationJOAFE,
  IImmatriculationJOAFE,
} from '#models/immatriculation/joafe';
import getImmatriculationRNCS, {
  IImmatriculationRNCS,
} from '#models/immatriculation/rncs';
import {
  getImmatriculationRNM,
  IImmatriculationRNM,
} from '#models/immatriculation/rnm';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { verifySiren } from '#utils/helpers';
import { isAssociation } from '.';
import { IUniteLegale } from '.';
import getImmatriculationRNE, {
  IImmatriculationRNE,
} from './immatriculation/rne';

export interface IJustificatifs {
  uniteLegale: IUniteLegale;
  immatriculationRNE: IImmatriculationRNE | IAPINotRespondingError;
  immatriculationRNM: IImmatriculationRNM | IAPINotRespondingError;
  immatriculationRNCS: IImmatriculationRNCS | IAPINotRespondingError;
  immatriculationJOAFE: IImmatriculationJOAFE | IAPINotRespondingError;
}

const getJustificatifs = async (slug: string) => {
  const siren = verifySiren(slug);

  const [
    uniteLegale,
    immatriculationRNM,
    immatriculationRNCS,
    immatriculationRNE,
  ] = await Promise.all([
    getUniteLegaleFromSlug(siren),
    getImmatriculationRNM(siren),
    getImmatriculationRNCS(siren),
    getImmatriculationRNE(siren),
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
    immatriculationRNE,
  };
};

export default getJustificatifs;
