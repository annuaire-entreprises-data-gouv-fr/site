import {
  createDefaultUniteLegale,
  IEtablissementsList,
  IUniteLegale,
  SirenNotFoundError,
} from '.';
import { HttpNotFound } from '../clients/exceptions';
import { InseeForbiddenError } from '../clients/sirene-insee';
import {
  getUniteLegaleInsee,
  getUniteLegaleInseeWithFallbackCredentials,
} from '../clients/sirene-insee/siren';
import { getAllEtablissementInsee } from '../clients/sirene-insee/siret';
import getUniteLegaleSireneOuverte from '../clients/sirene-ouverte/siren';
import { Siren, verifySiren } from '../utils/helpers/siren-and-siret';
import {
  logFirstSireneInseefailed,
  logSecondSireneInseefailed,
  logSireneOuvertefailed,
} from '../utils/sentry/helpers';

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
 * Fetch Unite Legale from Etalab SIRENE API with a fallback on INSEE's API
 */
const getUniteLegale = async (
  siren: Siren,
  page = 1
): Promise<IUniteLegale> => {
  try {
    // first attempt to call siren insee
    return await fetchUniteLegaleFromBothAPI(siren, page);
  } catch (e) {
    if (e instanceof HttpNotFound) {
      throw new SirenNotFoundError(`Siren ${siren} was not found`);
    }

    logFirstSireneInseefailed({ siren, details: e.message });

    try {
      // in case sirene INSEE 403, fallback on Siren Etalab
      return await getUniteLegaleSireneOuverte(siren, page);
    } catch (e) {
      logSireneOuvertefailed({ siren, details: e.message });

      try {
        // in case sirene etalab 404 or 500, fallback on Sirene insee using fallback credentials to avoid 403
        // no pagination as this function is called when sirene etalab already failed
        return await getUniteLegaleInseeWithFallbackCredentials(siren);
      } catch (e) {
        if (e instanceof InseeForbiddenError) {
          return createNonDiffusibleUniteLegale(siren);
        }
        logSecondSireneInseefailed({ siren, details: e.message });

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
const fetchUniteLegaleFromBothAPI = async (siren: Siren, page = 1) => {
  try {
    // INSEE does not provide enough information to paginate etablissement list
    // so we doubled our API call with sirene ouverte to get Etablissements.
    const [uniteLegaleInsee, etablissementsInsee, uniteLegaleSireneOuverte] =
      await Promise.all([
        getUniteLegaleInsee(siren),
        getAllEtablissementInsee(siren, page).catch(() => null),
        getUniteLegaleSireneOuverte(siren, page).catch(() => null),
      ]);

    return mergeUniteLegaleFromBothApi(
      uniteLegaleInsee,
      etablissementsInsee,
      uniteLegaleSireneOuverte
    );
  } catch (e) {
    if (e instanceof InseeForbiddenError) {
      return createNonDiffusibleUniteLegale(siren);
    }
    throw e;
  }
};

/**
 * Merge response form INSEE and Etalab, using best of both
 */
const mergeUniteLegaleFromBothApi = (
  uniteLegaleInsee: IUniteLegale,
  etablissementsInsee: IEtablissementsList | null,
  uniteLegaleSireneOuverte: IUniteLegale | null
) => {
  if (!uniteLegaleSireneOuverte) {
    return uniteLegaleInsee;
  }

  const etablissementsList = etablissementsInsee || uniteLegaleSireneOuverte;

  return {
    ...uniteLegaleInsee,
    // siege from INSEE lacks many information (adress etc.)
    siege: uniteLegaleSireneOuverte.siege,
    // these last fields are only available in Sirene ouverte
    etablissements: etablissementsList.etablissements,
    chemin: uniteLegaleSireneOuverte.chemin,
    currentEtablissementPage: etablissementsList.currentEtablissementPage,
    nombreEtablissements: etablissementsList.nombreEtablissements,
  };
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

export { getUniteLegaleFromSlug };
