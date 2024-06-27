import { clientTVA } from '#clients/api-proxy/tva';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { FetchRessourceException } from '#models/exceptions';
import { verifySiren, verifyTVANumber } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { tvaNumber } from './utils';

export const buildAndVerifyTVA = async (
  slug: string
): Promise<{ tva: string | null } | IAPINotRespondingError> => {
  const siren = verifySiren(slug);
  const tvaNumberFromSiren = verifyTVANumber(tvaNumber(siren));

  try {
    return { tva: await clientTVA(tvaNumberFromSiren) };
  } catch (e: any) {
    logErrorInSentry(
      new FetchRessourceException({
        ressource: 'TVAValidation',
        cause: e,
        context: { slug },
      })
    );
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.VIES, 404);
    }
    return APINotRespondingFactory(EAdministration.VIES, e?.status || 500);
  }
};
