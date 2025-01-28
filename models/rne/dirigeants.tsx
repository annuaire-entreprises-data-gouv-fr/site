import { clientRNEImmatriculation } from '#clients/api-proxy/rne';
import { HttpNotFound } from '#clients/exceptions';
import { clientDirigeantsRechercheEntreprise } from '#clients/recherche-entreprise/dirigeants';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { Siren, verifySiren } from '#utils/helpers';
import { IDirigeantsWithMetadata } from './types';

const fallback = async (siren: Siren) => {
  const dirigeants = await clientDirigeantsRechercheEntreprise(siren);
  return { data: dirigeants, metadata: { isFallback: true } };
};

/*
 * Request dirigeants from INPI's RNE
 * @param siren
 */
export const getDirigeantsRNE = async (
  maybeSiren: string,
  params: { isBot: boolean }
): Promise<IAPINotRespondingError | IDirigeantsWithMetadata> => {
  const siren = verifySiren(maybeSiren);

  try {
    if (params.isBot) {
      return await fallback(siren);
    }

    const { dirigeants } = await clientRNEImmatriculation(siren);
    return { data: dirigeants, metadata: { isFallback: false } };
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.INPI, 404);
    }

    try {
      return await fallback(siren);
    } catch (eFallback) {
      if (eFallback instanceof HttpNotFound) {
        return APINotRespondingFactory(EAdministration.INPI, 404);
      }
      return APINotRespondingFactory(EAdministration.INPI, 500);
    }
  }
};
