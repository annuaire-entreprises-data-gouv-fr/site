import { TVAUserException, clientTVA } from '#clients/api-proxy/tva';
import { verifySiren } from '#utils/helpers';
import { tvaNumber } from './utils';

export interface ITvaIntracommunautaire {
  numero: string;
  isValid: boolean;
}

/**
 * build TVA number from siren and then validate it
 */
export const tvaIntracommunautaire = async (
  slug: string
): Promise<string | null> => {
  const siren = verifySiren(slug);
  const tvaNumberFromSiren = tvaNumber(siren);

  try {
    return await clientTVA(tvaNumberFromSiren);
  } catch (eFirstTry: any) {
    if (eFirstTry instanceof TVAUserException) {
      throw eFirstTry;
    }
    // retry once as VIES randomely reset connection
    try {
      return await clientTVA(tvaNumberFromSiren);
    } catch (eFallback: any) {
      throw eFallback;
    }
  }
};
