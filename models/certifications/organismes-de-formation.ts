import { clientDGEFP } from '#clients/dgefp';
import { IOrganismesFormationResponse } from '#clients/dgefp/type';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale } from '..';

export const getOrganismesDeFormation = async (
  uniteLegale: IUniteLegale
): Promise<IOrganismesFormationResponse | IAPINotRespondingError> => {
  try {
    if (!uniteLegale.complements.estOrganismeFormation) {
      throw new HttpNotFound('Not organisme de formation');
    }
    return await clientDGEFP(uniteLegale.siren);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.MTPEI, 404);
    }
    logErrorInSentry('Error in API RGE', {
      siren: uniteLegale.siren,
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.MTPEI, 500);
  }
};
