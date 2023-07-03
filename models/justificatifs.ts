import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import {
  getImmatriculationJOAFE,
  IImmatriculationJOAFE,
} from '#models/immatriculation/joafe';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { verifySiren } from '#utils/helpers';
import { isAssociation } from '.';
import { IUniteLegale } from '.';
import { IImmatriculationRNE } from './immatriculation';
import getImmatriculationRNE from './immatriculation/rne';

export interface IJustificatifs {
  uniteLegale: IUniteLegale;
  immatriculationRNE: IImmatriculationRNE | IAPINotRespondingError;
  immatriculationJOAFE: IImmatriculationJOAFE | IAPINotRespondingError;
}

const getJustificatifs = async (slug: string) => {
  const siren = verifySiren(slug);

  const [uniteLegale, immatriculationRNE] = await Promise.all([
    getUniteLegaleFromSlug(siren),
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
    immatriculationJOAFE,
    immatriculationRNE,
  };
};

export default getJustificatifs;
