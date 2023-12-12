import { HttpNotFound } from '#clients/exceptions';
import { clientEntrepreneurSpectacles } from '#clients/open-data-soft/clients/entrepreneur-spectacles';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { FetchRessourceException } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale } from '..';

export interface IEntrepreneurSpectaclesCertification {
  licences: {
    categorie: number;
    numeroRecepisse: string;
    statut: string;
    dateValidite: string;
    dateDepot: string;
    type: string;
    nomLieu: string;
  }[];
  lastModified: string | null;
}

export const getEntrepreneurSpectaclesCertification = async (
  uniteLegale: IUniteLegale
): Promise<IEntrepreneurSpectaclesCertification | IAPINotRespondingError> => {
  try {
    if (!uniteLegale.complements.estEntrepreneurSpectacle) {
      return APINotRespondingFactory(EAdministration.MC, 404);
    }
    return await clientEntrepreneurSpectacles(uniteLegale.siren);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.MC, 404);
    }
    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: 'EntrepreneurSpectacles',
        context: {
          siren: uniteLegale.siren,
        },
        administration: EAdministration.MC,
      })
    );
    return APINotRespondingFactory(EAdministration.MC, 500);
  }
};
