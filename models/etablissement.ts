import { HttpForbiddenError, HttpNotFound } from '#clients/exceptions';
import { clientEtablissementRechercheEntreprise } from '#clients/recherche-entreprise/siret';
import { clientEtablissementInsee } from '#clients/sirene-insee/siret';
import { getGeoLoc } from '#models/geo-loc';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { extractSirenFromSiret, Siret, verifySiret } from '#utils/helpers';
import {
  logRechercheEntreprisefailed,
  logSireneInseefailed,
} from '#utils/sentry/helpers';
import {
  createDefaultEtablissement,
  IEtablissement,
  IEtablissementWithUniteLegale,
  SiretNotFoundError,
} from '.';

/*
 * Return an etablissement given an existing siret
 */
const getEtablissementFromSlug = async (
  slug: string,
  options?: { isBot: boolean }
): Promise<IEtablissement> => {
  const siret = verifySiret(slug);

  const isBot = options?.isBot || false;

  const etablissement = isBot
    ? await getEtablissementForGoodBot(siret)
    : await getEtablissement(siret);

  return etablissement;
};

/**
 * Return an Etablissement for a given siret
 */
const getEtablissement = async (siret: Siret): Promise<IEtablissement> => {
  try {
    return await clientEtablissementInsee(siret, {
      useCache: true,
      useFallback: false,
    });
  } catch (e: any) {
    if (e instanceof HttpForbiddenError) {
      return createNonDiffusibleEtablissement(siret);
    }
    if (e instanceof HttpNotFound) {
      throw new SiretNotFoundError(siret);
    }

    logSireneInseefailed({ siret, details: e.message }, false);

    try {
      return await clientEtablissementRechercheEntreprise(siret);
    } catch (firstFallback: any) {
      logRechercheEntreprisefailed({
        siret,
        details: firstFallback.message || firstFallback,
      });

      try {
        return await clientEtablissementInsee(siret, {
          useCache: true,
          useFallback: true,
        });
      } catch (lastFallback: any) {
        if (lastFallback instanceof HttpForbiddenError) {
          return createNonDiffusibleEtablissement(siret);
        }
        if (lastFallback instanceof HttpNotFound) {
          throw new SiretNotFoundError(siret);
        }
        logSireneInseefailed(
          {
            siret,
            details: lastFallback.message || lastFallback,
          },
          true
        );

        // both API failed to fetch this siren, return a 500
        throw lastFallback;
      }
    }
  }
};

/**
 * Return an Etablissement from sirene ouverte
 */
const getEtablissementForGoodBot = async (
  siret: Siret
): Promise<IEtablissement> => {
  try {
    return await clientEtablissementRechercheEntreprise(siret);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      throw new SiretNotFoundError(siret);
    }
    throw e;
  }
};

/**
 * Return an Etablissement and the corresponding UniteLegale
 */
const getEtablissementWithUniteLegaleFromSlug = async (
  slug: string,
  isBot = false
): Promise<IEtablissementWithUniteLegale> => {
  const etablissement = await getEtablissementFromSlug(slug, { isBot });
  const uniteLegale = await getUniteLegaleFromSlug(etablissement.siren, {
    isBot,
  });

  return { etablissement, uniteLegale };
};

/**
 * Download Etablissement and the Latitude/longitude
 */
const getEtablissementWithLatLongFromSlug = async (
  slug: string
): Promise<IEtablissement> => {
  const etablissement = await getEtablissementFromSlug(slug);
  const { lat, long } = await getGeoLoc(etablissement);
  etablissement.latitude = lat;
  etablissement.longitude = long;
  return etablissement;
};

//=========================
//        API calls
//=========================

/**
 * Create a default etablissement that will be displayed as non diffusible
 */
const createNonDiffusibleEtablissement = (siret: Siret) => {
  const etablissement = createDefaultEtablissement();
  etablissement.siret = siret;
  etablissement.siren = extractSirenFromSiret(siret);

  return etablissement;
};

export {
  getEtablissementWithUniteLegaleFromSlug,
  getEtablissementWithLatLongFromSlug,
  getEtablissementFromSlug,
};
