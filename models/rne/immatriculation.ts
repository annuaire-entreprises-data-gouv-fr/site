import {
  fetchRNEImmatriculation,
  fetchRNEImmatriculationFallback,
} from '#clients/api-proxy/rne';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { IUniteLegaleImmatriculation } from '#models/core/types';
import { verifySiren } from '#utils/helpers';

/*
 * Request Immatriculation from INPI's RNE
 * @param siren
 */
export const getImmatriculation = async (
  maybeSiren: string
): Promise<IAPINotRespondingError | IUniteLegaleImmatriculation> => {
  const siren = verifySiren(maybeSiren);

  try {
    const { immatriculation } = await fetchRNEImmatriculation(siren);
    return immatriculation;
  } catch (eDefaultTry: any) {
    if (eDefaultTry instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.INPI, 404);
    }

    try {
      const { immatriculation } = await fetchRNEImmatriculationFallback(siren);
      return immatriculation;
    } catch (eFallback: any) {
      if (eFallback instanceof HttpNotFound) {
        return APINotRespondingFactory(EAdministration.INPI, 404);
      }

      // no need to log an error as API-Proxy already logged it
      return APINotRespondingFactory(EAdministration.INPI, 500);
    }
  }
};
