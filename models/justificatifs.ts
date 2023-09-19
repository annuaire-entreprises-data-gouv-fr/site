import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import {
  IImmatriculationJOAFE,
  getImmatriculationJOAFE,
} from '#models/immatriculation/joafe';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { verifySiren } from '#utils/helpers';
import { IUniteLegale, isAssociation } from '.';
import { IImmatriculationRNE } from './immatriculation';

export interface IJustificatifs {
  uniteLegale: IUniteLegale;
  immatriculationJOAFE: IImmatriculationJOAFE | IAPINotRespondingError;
  immatriculationRNE: IImmatriculationRNE | IAPINotRespondingError | null;
}

const getJustificatifs = async (slug: string) => {
  const siren = verifySiren(slug);

  const uniteLegale = await getUniteLegaleFromSlug(siren);

  const immatriculationJOAFE = isAssociation(uniteLegale)
    ? await getImmatriculationJOAFE(
        siren,
        uniteLegale.association.idAssociation
      )
    : APINotRespondingFactory(EAdministration.DILA, 404);

  return {
    uniteLegale,
    immatriculationJOAFE,
  };
};

export default getJustificatifs;
