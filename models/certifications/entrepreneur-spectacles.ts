import { HttpNotFound } from '#clients/exceptions';
import { clientEntrepreneurSpectacles } from '#clients/open-data-soft/entrepreneur-spectacles';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale } from '..';

export interface IEntrepreneurSpectaclesCertification {
  licences: {
    numeroRecepisse: string;
    statut: string;
    dateValidite: string;
    dateDepot: string;
    type: string;
  }[];
  lastModified: string | null;
}

export const getEntrepreneurSpectaclesCertification = async (
  uniteLegale: IUniteLegale
): Promise<IEntrepreneurSpectaclesCertification | IAPINotRespondingError> => {
  try {
    if (!uniteLegale.complements.estEntrepreneurSpectacle) {
      throw new HttpNotFound('Not entrepreneur spectacles vivants');
    }
    return await clientEntrepreneurSpectacles(uniteLegale.siren);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.MC, 404);
    }
    logErrorInSentry('Error in API Spectacles Vivants', {
      siren: uniteLegale.siren,
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.MC, 500);
  }
};
