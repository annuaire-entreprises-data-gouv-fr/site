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
    annee: string | null;
    notes: number | null;
    notes_augmentations: number | null;
    notes_augmentations_et_promotions: number | null;
    notes_conges_maternite: number | null;
    notes_hautes_rémunérations: number | null;
    notes_promotions: number | null;
    notes_remunerations: number | null;
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
