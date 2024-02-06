import {
  HttpForbiddenError,
  HttpNotFound,
  HttpServerError,
} from '#clients/exceptions';
import { clientEtablissementRechercheEntreprise } from '#clients/recherche-entreprise/siret';
import { InseeClientOptions } from '#clients/sirene-insee';
import { clientEtablissementInsee } from '#clients/sirene-insee/siret';
import { getGeoLoc } from '#models/geo-loc';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { Siret, extractSirenFromSiret, verifySiret } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import {
  IEtablissement,
  IEtablissementWithUniteLegale,
  createDefaultEtablissement,
} from '.';
import { EAdministration } from './administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
  isAPINotResponding,
} from './api-not-responding';
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

  const etablissement = fetchFromClients(siret, isBot);

  return etablissement;
};

/**
 * Return an Etablissement for a given siret
 */
const fetchFromClients = async (
  siret: Siret,
  isBot = false
): Promise<IEtablissement> => {
  // no cache for bot as they scrap so they tend not to call the same siren twice
  const useCache = !isBot;

  const etablissementRechercheEntreprise =
    await fetchEtablissementFromRechercheEntreprise(siret, useCache);

  const useInsee = shouldUseInsee(etablissementRechercheEntreprise, isBot);

  if (!useInsee) {
    if (isAPINotResponding(etablissementRechercheEntreprise)) {
      throw new HttpServerError('Recherche failed, return 500');
    }
    return etablissementRechercheEntreprise;
  }

  const etablissementInsee = await fetchEtablissmentFromInsee(siret, {
    useFallback: false,
    useCache,
  });

  if (isAPINotResponding(etablissementInsee)) {
    if (isAPINotResponding(etablissementRechercheEntreprise)) {
      const etablissmentInseeFallbacked = await fetchEtablissmentFromInsee(
        siret,
        {
          useFallback: true,
          useCache,
        }
      );
      if (isAPINotResponding(etablissmentInseeFallbacked)) {
        throw new HttpServerError('Sirene Insee fallback failed, return 500');
      }
      return etablissmentInseeFallbacked;
    } else {
      return etablissementRechercheEntreprise;
    }
  } else {
    if (isAPINotResponding(etablissementRechercheEntreprise)) {
      return etablissementInsee;
    } else {
      return {
        ...etablissementInsee,
        complements: {
          ...etablissementInsee?.complements,
          ...etablissementRechercheEntreprise.complements,
        },
      };
    }
  }
};

const shouldUseInsee = (
  etablissementRechercheEntreprise: IEtablissement | IAPINotRespondingError,
  isBot: boolean
) => {
  const isInseeEnabled = process.env.INSEE_ENABLED !== 'disabled';

  if (!isInseeEnabled) {
    return false;
  }

  const rechercheEntrepriseFailed = isAPINotResponding(
    etablissementRechercheEntreprise
  );

  if (rechercheEntrepriseFailed) {
    return true;
  } else {
    if (isBot) {
      return false;
    }

    if (
      etablissementRechercheEntreprise.complements.estEntrepreneurIndividuel
    ) {
      return true;
    }

    return false;
  }
};
const fetchEtablissmentFromInsee = async (
  siret: Siret,
  options: InseeClientOptions
): Promise<IEtablissement | IAPINotRespondingError> => {
  try {
    return await clientEtablissementInsee(siret, options);
  } catch (e: any) {
    if (e instanceof HttpForbiddenError) {
      return createNonDiffusibleEtablissement(siret);
    }
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.INSEE, 404);
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
    return APINotRespondingFactory(EAdministration.INSEE, 500);
  }
};

const fetchEtablissementFromRechercheEntreprise = async (
  siret: Siret,
  useCache = false
): Promise<IEtablissement | IAPINotRespondingError> => {
  try {
    return await clientEtablissementRechercheEntreprise(siret, useCache);
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

    return APINotRespondingFactory(EAdministration.DINUM, 500);
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
