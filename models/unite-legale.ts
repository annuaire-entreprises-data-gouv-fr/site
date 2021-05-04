import { createDefaultUniteLegale, IUniteLegale, SirenNotFoundError } from '.';
import {
  HttpAuthentificationFailure,
  HttpNotFound,
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
const getUniteLegale = async (
  siren: string,
  page = 1
): Promise<IUniteLegale> => {
  isSiren(siren);

  try {
    // INSEE does not provide enough information to paginate etablissement list
    // so we doubled our API call with sirene ouverte to get Etablissements.
    const [uniteLegaleInsee, uniteLegaleSireneOuverte] = await Promise.all([
      getUniteLegaleInsee(siren),
      getUniteLegaleSireneOuverte(siren, page).catch((e) => null),
    ]);

    // API Sirene ouverte call failed, we only return siege as only etablissement
    if (!uniteLegaleSireneOuverte) {
      return uniteLegaleInsee;
    }

    return {
      ...uniteLegaleInsee,
      // siege from INSEE lacks many information (adress etc.)
      siege: uniteLegaleSireneOuverte.siege,
      // these last fields are only available in Sirene ouverte
      etablissements: uniteLegaleSireneOuverte.etablissements,
      chemin: uniteLegaleSireneOuverte.chemin,
      currentEtablissementPage:
        uniteLegaleSireneOuverte.currentEtablissementPage,
      nombreEtablissements: uniteLegaleSireneOuverte.nombreEtablissements,
    };
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
      // do nothing
    } else {
      logWarningInSentry(
        `Server error in Sirene Insee, fallback on Sirene Ouverte (Etalab) ${siren}. ${e}`
      );
    }
    try {
      return await getUniteLegaleSireneOuverte(siren, page);
    } catch (e) {
      if (e instanceof HttpNotFound) {
        // do nothing
      } else {
        logWarningInSentry(
          `Server error in SireneEtalab, fallback on not found. ${e}`
        );
      }

      // Siren was not found in both API
      const message = `Siren ${siren} was not found in both siren API`;
      throw new SirenNotFoundError(message);
    }
  }
};

export default getUniteLegale;
