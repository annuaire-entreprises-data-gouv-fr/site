import { IUniteLegale } from '.';
import {
  InseeAuthError,
  InseeForbiddenError,
  InseeTooManyRequestsError,
} from '../clients/sirene-insee';
import { getUniteLegaleInsee } from '../clients/sirene-insee/siren';
import { isSiren } from '../utils/helpers/siren-and-siret';
import { logWarningInSentry } from '../utils/sentry';

export class SirenNotFoundError extends Error {
  constructor(public message: string) {
    super();
  }
}
export class NotASirenError extends Error {
  constructor() {
    super();
  }
}

/**
 * Fetch Unite Legale from Etalab SIRENE API with a fallback on INSEE's API
 * @param siren
 */
const getUniteLegale = async (siren: string): Promise<IUniteLegale> => {
  if (!isSiren(siren)) {
    throw new NotASirenError();
  }

  try {
    return await getUniteLegaleSireneOuverte(siren);
  } catch (e) {
    try {
      return await getUniteLegaleInsee(siren);
    } catch (e) {
      if (
        e instanceof InseeTooManyRequestsError ||
        e instanceof InseeAuthError
      ) {
        logWarningInSentry(e);
      }

      if (e instanceof InseeForbiddenError) {
        // this means company is not diffusible
        return {
          siren,
          siege: {
            siren,
            isActive: null,
          },
          isDiffusible: false,
          fullName: 'Cette entreprise n’est pas diffusible',
          path: siren,
        };
      }

      // Siren was not found in both API
      const message = `Siren ${siren} was not found in both siren API`;
      logWarningInSentry(message);
      throw new SirenNotFoundError(message);
    }
  }
};

export default getUniteLegale;
