import { fetchRNEImmatriculation } from '#clients/api-proxy/rne';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { verifySiren } from '#utils/helpers';
import { IDirigeants } from '.';

/*
 * Request Immatriculation from INPI's RNE
 * @param siren
 */
export const getDirigeantsRNE = async (
  maybeSiren: string
): Promise<IAPINotRespondingError | IDirigeants> => {
  const siren = verifySiren(maybeSiren);

  try {
    const { dirigeants } = await fetchRNEImmatriculation(siren);

    return { data: dirigeants, metadata: { isFallback: false } };
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.INPI, 404);
    }

    return APINotRespondingFactory(EAdministration.INPI, 500);
  }
};
