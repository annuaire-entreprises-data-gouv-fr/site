import { clientEgapro } from '#clients/egapro';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale } from '..';

export interface IEgapro {
  employeesSizeRange: string;
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
}

export const getEgapro = async (
  uniteLegale: IUniteLegale
): Promise<IEgapro | IAPINotRespondingError> => {
  try {
    if (!uniteLegale.complements.egaproRenseignee) {
      return APINotRespondingFactory(EAdministration.MTPEI, 404);
    }
    return await clientEgapro(uniteLegale);
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
