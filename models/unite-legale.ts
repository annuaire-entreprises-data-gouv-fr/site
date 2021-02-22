import { IUniteLegale } from '.';
import {
  InseeAuthError,
  InseeForbiddenError,
  InseeTooManyRequestsError,
} from '../clients/sirene-insee';
import { getUniteLegaleInsee } from '../clients/sirene-insee/siren';
import logErrorInSentry from '../utils/sentry';

export class SirenNotFoundError extends Error {
  constructor(public message: string) {
    super();
  }
}

/**
 * Download Unite Legale from Etalab SIRENE API (fallback on INSEE's API)
 * @param siren
 */
const getUniteLegale = async (siren: string): IUniteLegale => {
  try {
    return await getUniteLegaleSireneOuverte(siren);
  } catch (e) {
    try {
      return await getUniteLegaleInsee(siren);
    } catch (e) {
      // not very happy with this architecture in case of async as it might shadow an error if several are thrown
      if (
        e instanceof InseeTooManyRequestsError ||
        e instanceof InseeAuthError
      ) {
        const errorMessage = `Siren ${siren} was not found in both siren API`;
        logErrorInSentry(errorMessage);
        throw new SirenNotFoundError(errorMessage);
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
    }
  }
};

export default getUniteLegale;
