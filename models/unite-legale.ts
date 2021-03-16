import {
  createDefaultUniteLegale,
  IUniteLegale,
  NotASirenError,
  SirenNotFoundError,
} from '.';
import {
  HttpAuthentificationFailure,
  HttpNotFound,
  HttpServerError,
  HttpTooManyRequests,
} from '../clients/exceptions';
import { InseeForbiddenError } from '../clients/sirene-insee';
import { getUniteLegaleInsee } from '../clients/sirene-insee/siren';
import getUniteLegaleSireneOuverte from '../clients/sirene-ouverte/siren';
import { isSiren } from '../utils/helpers/siren-and-siret';
import { logWarningInSentry } from '../utils/sentry';

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
    if (e instanceof HttpNotFound) {
      // do nothing
    } else {
      logWarningInSentry(
        `Server error in SireneEtalab, fallback on INSEE ${e}`
      );
    }
    try {
      return await getUniteLegaleInsee(siren);
    } catch (e) {
      if (
        e instanceof HttpTooManyRequests ||
        e instanceof HttpAuthentificationFailure
      ) {
        logWarningInSentry(e);
      } else if (e instanceof InseeForbiddenError) {
        // this means company is not diffusible
        const uniteLegale = createDefaultUniteLegale(siren);
        uniteLegale.estDiffusible = false;
        uniteLegale.nomComplet =
          'Les informations de cette entité ne sont pas publiques';

        return uniteLegale;
      } else if (e instanceof HttpNotFound) {
        // do nothin
      } else {
        logWarningInSentry(
          `Server error in SireneInsee, fallback on Siren not found ${e}`
        );
      }

      // Siren was not found in both API
      const message = `Siren ${siren} was not found in both siren API`;
      throw new SirenNotFoundError(message);
    }
  }
};

export default getUniteLegale;
