import { validateTVANumber } from '../clients/tva';
import { Siren } from '../utils/helpers/siren-and-siret';
import logErrorInSentry from '../utils/sentry';

export interface ITvaIntracommunautaire {
  numero: string;
  isValid: boolean;
}

/**
 * Compute TVA number from siren - include country code
 * @param siren
 * @returns
 */
export const tvaNumberWithCountryCode = (siren: Siren) => {
  const tvaNumberFromSiren = tvaNumber(siren);
  return tvaNumberFromSiren ? `FR${tvaNumberFromSiren}` : '';
};
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
  siren: Siren
): Promise<ITvaIntracommunautaire> => {
  try {
    const tvaNumberFromSiren = tvaNumber(siren);
    const isValid = await validateTVANumber(tvaNumberFromSiren);
    return {
      numero: tvaNumberWithCountryCode(siren),
      isValid,
    };
  } catch (e: any) {
    logErrorInSentry('Error in API TVA', { details: e.toString(), siren });
    return {
      numero: tvaNumberWithCountryCode(siren),
      isValid: false,
    };
  }
};
