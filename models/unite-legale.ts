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
import { getAllEtablissementInsee } from '../clients/sirene-insee/siret';
import getUniteLegaleSireneOuverte from '../clients/sirene-ouverte/siren';
import { isSiren } from '../utils/helpers/siren-and-siret';
import { logWarningInSentry } from '../utils/sentry';

/**
 * Fetch Unite Legale from Etalab SIRENE API with a fallback on INSEE's API
 * @param siren
 */
const getUniteLegale = async (
  siren: string,
  page = 1
): Promise<IUniteLegale> => {
  if (!isSiren(siren)) {
    throw new NotASirenError();
  }

  try {
    return await getUniteLegaleSireneOuverte(siren, page);
  } catch (e) {
    if (e instanceof HttpNotFound) {
      // do nothing
    } else {
      logWarningInSentry(
        `Server error in SireneEtalab, fallback on INSEE ${siren}. ${e}`
      );
    }
    try {
      const uniteLegale = await getUniteLegaleInsee(siren);
      const etablissements = await getAllEtablissementInsee(siren);
      uniteLegale.etablissements = etablissements;

      const siege = etablissements.find((e) => e.estSiege);
      if (siege) {
        uniteLegale.siege = siege;
      }
      return uniteLegale;
    } catch (e) {
      if (
        e instanceof HttpTooManyRequests ||
        e instanceof HttpAuthentificationFailure
      ) {
        logWarningInSentry(e.message);
      } else if (e instanceof InseeForbiddenError) {
        // this means company is not diffusible
        const uniteLegale = createDefaultUniteLegale(siren);
        uniteLegale.estDiffusible = false;
        uniteLegale.nomComplet =
          'Les informations de cette entité ne sont pas publiques';

        return uniteLegale;
      } else if (e instanceof HttpNotFound) {
        // do nothin
      }

      // Siren was not found in both API
      const message = `Siren ${siren} was not found in both siren API`;
      throw new SirenNotFoundError(message);
    }
  }
};

export default getUniteLegale;
