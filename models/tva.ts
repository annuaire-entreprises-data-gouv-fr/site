import { Siren } from '#utils/helpers';

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
