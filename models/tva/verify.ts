import { TVAUserException, clientTVA } from '#clients/api-proxy/tva';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { verifySiren, verifyTVANumber } from '#utils/helpers';
import { tvaNumber } from './utils';

export const buildAndVerifyTVA = async (
  slug: string
): Promise<{ tva: string | null } | IAPINotRespondingError> => {
  const siren = verifySiren(slug);
  const tvaNumberFromSiren = verifyTVANumber(tvaNumber(siren));

  try {
    return { tva: await clientTVA(tvaNumberFromSiren) };
  } catch (e: any) {
    if (e instanceof TVAUserException) {
      throw e;
    }

    // no need to log an error as API-Proxy already logged it
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.VIES, 404);
    }
    return APINotRespondingFactory(EAdministration.VIES, 500);
  }
};
