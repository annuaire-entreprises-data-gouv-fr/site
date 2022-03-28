import {
  createDefaultUniteLegale,
  IEtablissement,
  IEtablissementsList,
  IUniteLegale,
  SirenNotFoundError,
} from '.';
import { HttpForbiddenError, HttpNotFound } from '../clients/exceptions';
import {
  getUniteLegaleInsee,
  getUniteLegaleInseeWithFallbackCredentials,
} from '../clients/sirene-insee/siren';
import {
  getAllEtablissementsInsee,
  getAllEtablissementsInseeWithFallbackCredentials,
  getSiegeInsee,
  getSiegeInseeWithFallbackCredentials,
} from '../clients/sirene-insee/siret';
import getUniteLegaleSireneOuverte from '../clients/sirene-ouverte/siren';
import { Siren, verifySiren } from '../utils/helpers/siren-and-siret';
import {
  logFirstSireneInseefailed,
  logSecondSireneInseefailed,
  logSireneOuvertefailed,
} from '../utils/sentry/helpers';
import { getAssociation } from './association';

/**
 * Return an uniteLegale with RNA if
 */
const getUniteLegaleWithRNAFromSlug = async (slug: string, page = 1) => {
  const uniteLegale = await getUniteLegaleFromSlug(slug, page);
  if (uniteLegale.association && uniteLegale.association.id) {
    uniteLegale.association = {
      ...(await getAssociation(uniteLegale.association.id, uniteLegale)),
      id: uniteLegale.association.id,
    };
  }
  return uniteLegale;
};

/**
 * Return an uniteLegale given an existing siren
 */
const getUniteLegaleFromSlug = async (
  slug: string,
  page = 1
): Promise<IUniteLegale> => {
  const siren = verifySiren(slug);

  const uniteLegale = await getUniteLegale(siren, page);

  if (!uniteLegale.estDiffusible) {
    uniteLegale.nomComplet = 'Entité non-diffusible';
  }
  return uniteLegale;
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
    return await fetchUniteLegaleFromInsee(siren, page);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      throw new SirenNotFoundError(siren);
    }
    logFirstSireneInseefailed({ siren, details: e.message || e });

    try {
      // in case sirene INSEE 429 or 500, fallback on Siren Etalab
      return await getUniteLegaleSireneOuverte(siren, page);
    } catch (e: any) {
      logSireneOuvertefailed({ siren, details: e.message || e });

      try {
        // in case sirene etalab 404 or 500, fallback on Sirene insee using fallback credentials to avoid 403
        // no pagination as this function is called when sirene etalab already failed
        return await fetchUniteLegaleFromInseeFallback(siren, page);
      } catch (e: any) {
        logSecondSireneInseefailed({ siren, details: e.message || e });

        // Siren was not found in both API, return a 404
        throw new SirenNotFoundError(siren);
      }
    }
  }
};

/**
 * Return an uniteLegale from SireneOuverte
 *
 * @param siren
 * @param page
 * @returns
 */
const getUniteLegaleFromSlugForGoodBot = async (
  slug: string,
  page = 1
): Promise<IUniteLegale> => {
  const siren = verifySiren(slug);
  try {
    return await getUniteLegaleSireneOuverte(siren, page);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      // when not found in siren ouverte, fallback on insee
      try {
        return await fetchUniteLegaleFromInsee(siren, page);
      } catch (ee: any) {
        // in any Insee error
        throw new SirenNotFoundError(siren);
      }
    }
    throw e;
  }
};

//=========================
//        API calls
//=========================

/**
 * Fetch Unite Legale from Sirene INSEE and Etalab
 */
const fetchUniteLegaleFromInsee = async (siren: Siren, page = 1) => {
  try {
    // INSEE does not provide enough information to paginate etablissement list
    // so we doubled our API call with sirene ouverte to get Etablissements.
    const [uniteLegaleInsee, allEtablissementsInsee, siegeInsee] =
      await Promise.all([
        getUniteLegaleInsee(siren),
        getAllEtablissementsInsee(siren, page).catch(() => null),
        getSiegeInsee(siren).catch(() => null),
      ]);

    return mergeUniteLegaleFromBothApi(
      uniteLegaleInsee,
      allEtablissementsInsee,
      siegeInsee
    );
  } catch (e: any) {
    if (e instanceof HttpForbiddenError) {
      return createNonDiffusibleUniteLegale(siren);
    }
    throw e;
  }
};

/**
 * Fetch Unite Legale from Sirene INSEE only, using fallback credentials
 */
const fetchUniteLegaleFromInseeFallback = async (siren: Siren, page = 1) => {
  try {
    // INSEE requires two calls to get uniteLegale with etablissements
    const [uniteLegaleInsee, allEtablissementsInsee, siegeInsee] =
      await Promise.all([
        getUniteLegaleInseeWithFallbackCredentials(siren),
        getAllEtablissementsInseeWithFallbackCredentials(siren, page).catch(
          () => null
        ),
        getSiegeInseeWithFallbackCredentials(siren).catch(() => null),
      ]);

    return mergeUniteLegaleFromBothApi(
      uniteLegaleInsee,
      allEtablissementsInsee,
      siegeInsee
    );
  } catch (e: any) {
    if (e instanceof HttpForbiddenError) {
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
  allEtablissementsInsee: IEtablissementsList | null,
  siegeInsee: IEtablissement | null
) => {
  const siege = siegeInsee || uniteLegaleInsee.siege;

  const chemin = `${uniteLegaleInsee.nomComplet}-${uniteLegaleInsee.siren}`
    .toLowerCase()
    .replaceAll(/[^a-zA-Z0-9]+/g, '-');

  return {
    ...uniteLegaleInsee,
    siege,
    chemin,
    etablissements: allEtablissementsInsee?.etablissements || [siege],
    currentEtablissementPage:
      allEtablissementsInsee?.currentEtablissementPage || 0,
    nombreEtablissements: allEtablissementsInsee?.nombreEtablissements || 1,
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

export {
  getUniteLegaleFromSlug,
  getUniteLegaleWithRNAFromSlug,
  getUniteLegaleFromSlugForGoodBot,
};
