import { clientEss } from '#clients/api-data-gouv/ess';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { FetchRessourceException } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale } from '..';

export interface IESS {
  familleJuridique: string;
  nom: string;
  region: string;
}

export const getEss = async (
  uniteLegale: IUniteLegale
): Promise<IESS | IAPINotRespondingError> => {
  try {
    if (!uniteLegale.complements.estEss) {
      return APINotRespondingFactory(EAdministration.ESSFRANCE, 404);
    }
    return await clientEss(uniteLegale.siren);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.ESSFRANCE, 404);
    }
    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: 'EconomieSocialeEtSolidaire',
        context: {
          siren: uniteLegale.siren,
        },
        administration: EAdministration.ESSFRANCE,
      })
    );
    return APINotRespondingFactory(EAdministration.ESSFRANCE, 500);
  }
};
