import { clientEgapro } from '#clients/egapro';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale } from '.';

export interface IEgapro {
  employeesSizeRange: string;
  scores: {
    annee: string;
    notes: number;
    notes_augmentations: number;
    notes_augmentations_et_promotions: number;
    notes_conges_maternite: number;
    notes_hautes_rémunérations: number;
    notes_promotions: number;
    notes_remunerations: number;
  }[];
}

export const getEgapro = async (
  uniteLegale: IUniteLegale
): Promise<IEgapro | IAPINotRespondingError> => {
  try {
    if (!uniteLegale.complements.egaproRenseignee) {
      return APINotRespondingFactory(EAdministration.METI, 404);
    }
    return await clientEgapro(uniteLegale.siren);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.METI, 404);
    }
    logErrorInSentry('Error in API EGAPRO', {
      siren: uniteLegale.siren,
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.METI, 500);
  }
};
