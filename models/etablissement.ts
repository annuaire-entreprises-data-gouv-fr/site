import { HttpForbiddenError, HttpNotFound } from '#clients/exceptions';
import { clientEtablissementSireneOuverte } from '#clients/recherche-entreprise/siren';
import {
  clientEtablissementInsee,
  clientEtablissementInseeFallback,
} from '#clients/sirene-insee/siret';
import { getGeoLoc } from '#models/geo-loc';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { extractSirenFromSiret, Siret, verifySiret } from '#utils/helpers';
import {
  logFirstSireneInseefailed,
  logSecondSireneInseefailed,
  logSireneOuvertefailed,
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
    return await clientEtablissementInsee(siret);
  } catch (e: any) {
    if (e instanceof HttpForbiddenError) {
      return createNonDiffusibleEtablissement(siret);
    }
    if (e instanceof HttpNotFound) {
      throw new SiretNotFoundError(siret);
    }

    logFirstSireneInseefailed({ siret, details: e.message });

    try {
      return await clientEtablissementSireneOuverte(siret);
    } catch (e: any) {
      logSireneOuvertefailed({ siret, details: e.message });

      try {
        return await clientEtablissementInseeFallback(siret);
      } catch (e: any) {
        if (e instanceof HttpForbiddenError) {
          return createNonDiffusibleEtablissement(siret);
        }
        logSecondSireneInseefailed({ siret, details: e.message });

        // Siret was not found in both API, return a 404
        throw new SiretNotFoundError(siret);
      }
    }
  }
};

/**
 * Return an Etablissement from sirene ouverte
 */
const getEtablissementForGoodBot = async (
  slug: string
): Promise<IEtablissement> => {
  try {
    return await clientEtablissementSireneOuverte(slug);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      throw new SiretNotFoundError(slug);
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
