import { clientEgapro } from '#clients/egapro';
import { clientEgaproRepresentationEquilibre } from '#clients/egapro/representationEquilibre';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale } from '..';

export interface IEgapro {
  index: {
    employeesSizeRange: string;
    moreThan1000: boolean;
    lessThan250: boolean;
    years: string[];
    indexYears: string[];
    scores: {
      notes: number[];
      augmentations: number[];
      augmentationsPromotions: number[];
      congesMaternite: number[];
      hautesRemunerations: number[];
      promotions: number[];
      remunerations: number[];
    };
  };
  representation?: {
    years: string[];
    scores: {
      pourcentageFemmesCadres: number[];
      pourcentageHommesCadres: number[];
      pourcentageFemmesMembres: number[];
      pourcentageHommesMembres: number[];
    };
  };
}

export const getEgapro = async (
  uniteLegale: IUniteLegale
): Promise<IEgapro | IAPINotRespondingError> => {
  try {
    if (!uniteLegale.complements.egaproRenseignee) {
      return APINotRespondingFactory(EAdministration.MTPEI, 404);
    }
    const indexEgapro = await clientEgapro(uniteLegale.siren);
    return {
      index: indexEgapro,
      representation: indexEgapro.moreThan1000 ? await clientEgaproRepresentationEquilibre(
              uniteLegale.siren
            ) : null,
    };
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.MTPEI, 404);
    }
    logErrorInSentry('Error in API EGAPRO', {
      siren: uniteLegale.siren,
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.MTPEI, 500);
  }
};
