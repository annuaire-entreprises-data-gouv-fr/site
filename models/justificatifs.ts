import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import {
  IImmatriculationJOAFE,
  getImmatriculationJOAFE,
} from '#models/immatriculation/joafe';
import { verifySiren } from '#utils/helpers';
import { EAdministration } from './administrations/EAdministration';
import { IAPILoading } from './api-loading';
import { IImmatriculationRNE } from './immatriculation';
import { IUniteLegale, isAssociation } from './core/types';

export interface IJustificatifs {
  uniteLegale: IUniteLegale;
  immatriculationJOAFE: IImmatriculationJOAFE | IAPINotRespondingError;
  immatriculationRNE:
    | IImmatriculationRNE
    | IAPINotRespondingError
    | IAPILoading;
}

const getJustificatifs = async (slug: string, isBot: boolean) => {
  const siren = verifySiren(slug);

  const uniteLegale = await getUniteLegaleFromSlug(siren, { isBot });

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
