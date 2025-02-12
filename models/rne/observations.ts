import {
  clientRNEImmatriculation,
  clientRNEImmatriculationFallback,
} from '#clients/api-proxy/rne';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { Siren, verifySiren } from '#utils/helpers';
import { IObservationsWithMetadata } from './types';

const fallback = async (siren: Siren) => {
  const { observations } = await clientRNEImmatriculationFallback(siren);
  return { data: observations, metadata: { isFallback: true } };
};

/*
 * Request observations from INPI's RNE
 * @param siren
 */
export const getRNEObservations = async (
  maybeSiren: string
): Promise<IAPINotRespondingError | IObservationsWithMetadata> => {
  const siren = verifySiren(maybeSiren);

  try {
    const { observations } = await clientRNEImmatriculation(siren);
    return { data: observations, metadata: { isFallback: false } };
  } catch (eDefaultTry: any) {
    if (eDefaultTry instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.INPI, 404);
    }

    try {
      return await fallback(siren);
    } catch (eFallback: any) {
      if (eFallback instanceof HttpNotFound) {
        return APINotRespondingFactory(EAdministration.INPI, 404);
      }

      // no need to log an error as API-Proxy already logged it
      return APINotRespondingFactory(EAdministration.INPI, 500);
    }
  }
};
