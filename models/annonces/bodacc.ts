import clientBodacc from '#clients/open-data-soft/clients/bodacc';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { verifySiren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { IAnnoncesBodacc } from '.';

export const getAnnoncesBodaccFromSlug = async (
  slug: string
): Promise<IAnnoncesBodacc | IAPINotRespondingError> => {
  const siren = verifySiren(slug);
  try {
    return await clientBodacc(siren);
  } catch (e: any) {
    logErrorInSentry(e, {
      siren,
      errorName: 'Error in API Bodacc',
    });
    return APINotRespondingFactory(EAdministration.DILA, 500);
  }
};
