import { clientEgaproRepresentationEquilibre } from '#clients/egapro/representationEquilibre';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale } from '..';

export interface IEgaproRepresentation {
  years: string[];
  scores: {
    pourcentageFemmesCadres: number[];
    pourcentageHommesCadres: number[];
    pourcentageFemmesMembres: number[];
    pourcentageHommesMembres: number[];
  };
}

export const getEgaproRepresentation = async (
  uniteLegale: IUniteLegale
): Promise<IEgaproRepresentation | IAPINotRespondingError> => {
  try {
    if (!uniteLegale.complements.egaproRenseignee) {
      return APINotRespondingFactory(EAdministration.MTPEI, 404);
    }
    return await clientEgaproRepresentationEquilibre(uniteLegale.siren);
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
