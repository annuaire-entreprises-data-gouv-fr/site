import { HttpForbiddenError, HttpNotFound } from '#clients/exceptions';
import { clientEtablissementRechercheEntreprise } from '#clients/recherche-entreprise/siret';
import { clientEtablissementInsee } from '#clients/sirene-insee/siret';
import { getGeoLoc } from '#models/geo-loc';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { Siret, extractSirenFromSiret, verifySiret } from '#utils/helpers';
import logErrorInSentry, { logFatalErrorInSentry } from '#utils/sentry';
import {
  IEtablissement,
  IEtablissementWithUniteLegale,
  SiretNotFoundError,
  createDefaultEtablissement,
} from '.';
import { EAdministration } from './administrations/EAdministration';
import { FetchRessourceException, IExceptionContext } from './exceptions';

/*
 * Return an etablissement given an existing siret
 */
const getEtablissementFromSlug = async (
  slug: string,
  options?: { isBot: boolean }
): Promise<IEtablissement> => {
  const siret = verifySiret(slug);

  const isBot = options?.isBot || false;
  const shouldNotUseInsee = process.env.INSEE_ENABLED === 'disabled';

  const etablissement =
    shouldNotUseInsee || isBot
      ? await getEtablissementRechercheEntreprise(siret)
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

    logErrorInSentry(
      new FetchEtablissementException({
        message: 'Fail to fetch from INSEE API',
        cause: e,
        administration: EAdministration.INSEE,
        context: {
          siret,
        },
      })
    );

    try {
      return await clientEtablissementRechercheEntreprise(siret);
    } catch (firstFallback: any) {
      logErrorInSentry(
        new FetchEtablissementException({
          message: 'Fail to fetch from Search API',
          cause: firstFallback,
          administration: EAdministration.DINUM,
          context: {
            siret,
          },
        })
      );

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

        // both API failed to fetch this siren, return a 500

        const error = new FetchEtablissementException({
          message: 'Fail to fetch from INSEE fallback API',
          cause: e,
          administration: EAdministration.INSEE,
          context: {
            siret,
          },
        });
        logFatalErrorInSentry(error);
        throw error;
      }
    }
  }
};

type IFetchEtablissementExceptionArgs = {
  message: string;
  cause: any;
  administration: EAdministration;
  context?: IExceptionContext;
};
class FetchEtablissementException extends FetchRessourceException {
  constructor(args: IFetchEtablissementExceptionArgs) {
    super({
      ...args,
      ressource: 'Etablissement',
    });
  }
}

/**
 * Return an Etablissement from sirene ouverte
 */
const getEtablissementRechercheEntreprise = async (
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
  if (!etablissement.latitude || !etablissement.longitude) {
    const { lat, long } = await getGeoLoc(etablissement);
    etablissement.latitude = lat;
    etablissement.longitude = long;
  }
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
  getEtablissementFromSlug,
  getEtablissementWithLatLongFromSlug,
  getEtablissementWithUniteLegaleFromSlug,
};
