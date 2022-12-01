import { clientTVA } from '../clients/tva';
import { Siren, verifySiren } from '../utils/helpers/siren-and-siret';
import logErrorInSentry from '../utils/sentry';

export interface ITvaIntracommunautaire {
  numero: string;
  isValid: boolean;
}

/**
 * Compute TVA number from siren - does not include country code
 * @param siren
 * @returns
 */
export const tvaNumber = (siren: Siren) => {
  try {
    const tvaNumber = (12 + ((3 * parseInt(siren, 10)) % 97)) % 97;
    return `${tvaNumber < 10 ? '0' : ''}${tvaNumber}${siren}`;
  } catch {
    return '';
  }
};

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
  } catch {
    // retry once as VIES randomely reset connection
    try {
      return await clientTVA(tvaNumberFromSiren);
    } catch (eFallback: any) {
      logErrorInSentry('Error in API TVA', {
        details: eFallback.toString(),
        siren: slug,
      });
      throw eFallback;
    }
  }
};
