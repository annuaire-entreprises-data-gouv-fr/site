import {
  createDefaultUniteLegale,
  IUniteLegale,
  NotASirenError,
  NotLuhnValidSirenError,
  SirenNotFoundError,
} from '.';
import { InseeForbiddenError } from '../clients/sirene-insee';
import { getUniteLegaleInsee } from '../clients/sirene-insee/siren';
import getUniteLegaleSireneOuverte from '../clients/sirene-ouverte/siren';
import {
  hasSirenFormat,
  isSiren,
  Siren,
} from '../utils/helpers/siren-and-siret';
import { logWarningInSentry } from '../utils/sentry';

/**
 * Return an uniteLegale given an existing siren
 */
const getUniteLegaleFromSlug = async (
  slug: string,
  page = 1
): Promise<IUniteLegale> => {
  const siren = verifySiren(slug);
  return getUniteLegale(siren, page);
};

/**
 * throw an exception if a string is not a siren
 * */
const verifySiren = (slug: string): Siren => {
  if (!isSiren(slug)) {
    if (!hasSirenFormat(slug)) {
      throw new NotASirenError(slug);
    } else {
      throw new NotLuhnValidSirenError(slug);
    }
  }
  return slug;
};

/**
 * Fetch Unite Legale from Etalab SIRENE API with a fallback on INSEE's API
 */
const getUniteLegale = async (
  siren: Siren,
  page = 1
): Promise<IUniteLegale> => {
  try {
    // first attempt to call siren insee
    return fetchUniteLegaleFromBothAPI(siren, page);
  } catch (e) {
    try {
      // in case sirene INSEE 403, fallback on Siren Etalab
      return fetchFromSirenOuverteOnly(siren, page);
    } catch (e) {
      try {
        // in case sirene 404, fallback on Sirene insee using fallback token to avoid 403
        return fetchUniteLegaleFromBothAPI(siren, page, true);
      } catch (e) {
        // Siren was not found in both API, return a 404
        const message = `Siren ${siren} was not found in both siren API`;
        throw new SirenNotFoundError(message);
      }
    }
  }
};

//=========================
//        API calls
//=========================

/**
 * Fetch Unite Legale from Sirene INSEE and Etalab
 */
const fetchUniteLegaleFromBothAPI = async (
  siren: Siren,
  page = 1,
  useInseeFallback?: boolean
) => {
  try {
    // INSEE does not provide enough information to paginate etablissement list
    // so we doubled our API call with sirene ouverte to get Etablissements.
    const [uniteLegaleInsee, uniteLegaleSireneOuverte] = await Promise.all([
      getUniteLegaleInsee(siren, useInseeFallback),
      getUniteLegaleSireneOuverte(siren, page).catch((e) => null),
    ]);

    if (!uniteLegaleSireneOuverte) {
      return uniteLegaleInsee;
    }

    return mergeUniteLegaleFromBothApi(
      uniteLegaleInsee,
      uniteLegaleSireneOuverte
    );
  } catch (e) {
    if (e instanceof InseeForbiddenError) {
      return createNonDiffusibleUniteLegale(siren);
    }

    // HttpTooManyRequests, HttpAuthentificationFailure, HttpNotFound, HttpServerError
    // 404 and 500, do nothing and fallback on etalab API
    const sentryMsg = `Server error in Sirene Insee ${
      useInseeFallback
        ? 'with fallback token, returning 404'
        : ', fallback on Sirene Ouverte (Etalab)'
    }`;
    logWarningInSentry(sentryMsg, { siren, details: e.message });
    throw e;
  }
};

/**
 * Create a default UniteLegale that will display as non diffusible
 */
const createNonDiffusibleUniteLegale = (siren: Siren) => {
  const uniteLegale = createDefaultUniteLegale(siren);
  uniteLegale.estDiffusible = false;
  uniteLegale.nomComplet =
    'Les informations de cette entité ne sont pas publiques';

  return uniteLegale;
};

/**
 * Merge response form INSEE and Etalab, using best of both
 */
const mergeUniteLegaleFromBothApi = (
  uniteLegaleInsee: IUniteLegale,
  uniteLegaleSireneOuverte: IUniteLegale
) => {
  return {
    ...uniteLegaleInsee,
    // siege from INSEE lacks many information (adress etc.)
    siege: uniteLegaleSireneOuverte.siege,
    // these last fields are only available in Sirene ouverte
    etablissements: uniteLegaleSireneOuverte.etablissements,
    chemin: uniteLegaleSireneOuverte.chemin,
    currentEtablissementPage: uniteLegaleSireneOuverte.currentEtablissementPage,
    nombreEtablissements: uniteLegaleSireneOuverte.nombreEtablissements,
  };
};

/**
 * Fetch Unite Legale from Sirene Etalab only
 */
const fetchFromSirenOuverteOnly = async (siren: Siren, page = 1) => {
  try {
    // fallback on sirene ouverte
    return await getUniteLegaleSireneOuverte(siren, page);
  } catch (e) {
    logWarningInSentry(
      'Server error in SireneEtalab, fallback on Sirene Insee with fallback token',
      {
        siren,
        details: e.message,
      }
    );
    throw e;
  }
};

export { getUniteLegaleFromSlug };
