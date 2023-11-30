import { TVAUserException, clientTVA } from '#clients/api-vies';
import { HttpConnectionReset } from '#clients/exceptions';
import { verifySiren } from '#utils/helpers';
import { logWarningInSentry } from '#utils/sentry';
import { tvaNumber } from './utils';

export const buildAndVerifyTVA = async (
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
      if (eFirstTry instanceof HttpConnectionReset) {
        logWarningInSentry('ECONNRESET in API TVA : retrying');
      } else {
        logWarningInSentry('Error in API TVA : retrying');
      }
      return await clientTVA(tvaNumberFromSiren);
    } catch (eFallback: any) {
      throw eFallback;
    }
  }
};
