import {
  HttpForbiddenError,
  HttpNotFound,
  HttpServerError,
} from '#clients/exceptions';
import { clientEtablissementRechercheEntreprise } from '#clients/recherche-entreprise/siret';
import { clientEtablissementInsee } from '#clients/sirene-insee/siret';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import { isProtectedSiren } from '#models/protected-siren';
import {
  Siret,
  extractNicFromSiret,
  extractSirenFromSiret,
  verifySiret,
} from '#utils/helpers';
import logErrorInSentry, {
  logFatalErrorInSentry,
  logWarningInSentry,
} from '#utils/sentry';
import getSession from '#utils/server-side-helper/app/get-session';
import { shouldUseInsee } from '.';
import { EAdministration } from '../administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
  isAPI404,
  isAPINotResponding,
} from '../api-not-responding';
import { FetchRessourceException, IExceptionContext } from '../exceptions';
import {
  ISTATUTDIFFUSION,
  anonymiseEtablissement,
  estDiffusible,
} from './diffusion';
import {
  IEtablissement,
  IEtablissementWithUniteLegale,
  SiretNotFoundError,
  createDefaultEtablissement,
} from './types';

/*
 * Return an etablissement given an existing siret
 */
const getEtablissementFromSlug = async (
  slug: string,
  options?: { isBot: boolean }
): Promise<IEtablissement> => {
  const siret = verifySiret(slug);

  const isBot = options?.isBot || false;

  const etablissement = await fetchFromClients(siret, isBot);

  const siren = extractSirenFromSiret(siret);

  if ((await isProtectedSiren(siren)) && estDiffusible(etablissement)) {
    etablissement.statutDiffusion = ISTATUTDIFFUSION.PROTECTED;
  }

  const session = await getSession();
  return anonymiseEtablissement(etablissement, session);
};

/**
 * Return an Etablissement for a given siret
 */
const fetchFromClients = async (
  siret: Siret,
  isBot = false
): Promise<IEtablissement> => {
  // no cache for bot as they scrap so they tend not to call the same siren twice

  const etablissementRechercheEntreprise =
    await fetchEtablissementFromRechercheEntreprise(siret);

  const useInsee = shouldUseInsee(
    etablissementRechercheEntreprise,
    isBot,
    (e: IEtablissement) =>
      !estDiffusible(e) || e.complements.estEntrepreneurIndividuel
  );

  if (!useInsee) {
    if (isAPI404(etablissementRechercheEntreprise)) {
      throw new SiretNotFoundError(siret);
    }
    if (isAPINotResponding(etablissementRechercheEntreprise)) {
      throw new HttpServerError('Recherche failed, return 500');
    }
    return etablissementRechercheEntreprise;
  }

  const etablissementInsee = await fetchEtablissmentFromInsee(siret, false);

  /**
   * Nowhere to be found
   */
  if (
    isAPI404(etablissementRechercheEntreprise) &&
    isAPI404(etablissementInsee)
  ) {
    throw new SiretNotFoundError(siret);
  }

  if (isAPINotResponding(etablissementInsee)) {
    /***
     * Sirene Insee failed
     */
    if (isAPI404(etablissementRechercheEntreprise)) {
      throw new SiretNotFoundError(siret);
    } else if (isAPINotResponding(etablissementRechercheEntreprise)) {
      throw new HttpServerError('Both API failed');
    } else {
      return etablissementRechercheEntreprise;
    }
  } else {
    /**
     * Sirene succeed but siret is not in recherhce or recherche failed
     */
    if (
      isAPINotResponding(etablissementRechercheEntreprise) ||
      isAPI404(etablissementRechercheEntreprise)
    ) {
      logWarningInSentry(
        new FetchRessourceException({
          ressource: 'UniteLegaleRecherche',
          administration: EAdministration.DINUM,
          message: 'Fail to find siret in recherche API',
          context: {
            siret,
          },
        })
      );
      return etablissementInsee;
    }
  }

  // default case
  return {
    ...etablissementInsee,
    complements: {
      ...etablissementInsee?.complements,
      ...etablissementRechercheEntreprise.complements,
    },
  };
};

const fetchEtablissmentFromInsee = async (
  siret: Siret,
  useFallback: boolean
): Promise<IEtablissement | IAPINotRespondingError> => {
  try {
    return await clientEtablissementInsee(siret, useFallback);
  } catch (e: any) {
    if (e instanceof HttpForbiddenError) {
      return createNonDiffusibleEtablissement(siret);
    }
    if (e instanceof HttpNotFound) {
      throw new SiretNotFoundError(siret);
    }

    if (!useFallback) {
      return await fetchEtablissmentFromInsee(siret, true);
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
  useFallback = false
): Promise<IEtablissement | IAPINotRespondingError> => {
  try {
    return await clientEtablissementRechercheEntreprise(siret);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.DINUM, 404);
    }
    if (!useFallback) {
      return await fetchEtablissementFromRechercheEntreprise(siret, true);
    }

    logFatalErrorInSentry(
      new FetchEtablissementException({
        message: 'Fail to fetch from Search API',
        cause: e,
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
  const etablissement = await getEtablissementFromSlug(slug, {
    isBot,
  });

  const uniteLegale = await getUniteLegaleFromSlug(etablissement.siren, {
    isBot,
  });

  // only for insee as recherche already holds ancienSiege at etablissement level
  if (uniteLegale.anciensSiegesSirets.indexOf(etablissement.siret) > -1) {
    etablissement.ancienSiege = true;
  }

  return { etablissement, uniteLegale };
};

//=========================
//        API calls
//=========================

/**
 * Create a default etablissement that will be displayed as non diffusible
 */
export const createNonDiffusibleEtablissement = (siret: Siret) => {
  const etablissement = createDefaultEtablissement();
  etablissement.siret = siret;
  etablissement.siren = extractSirenFromSiret(siret);
  etablissement.nic = extractNicFromSiret(siret);
  etablissement.statutDiffusion = ISTATUTDIFFUSION.NON_DIFF_STRICT;
  return etablissement;
};

export { getEtablissementWithUniteLegaleFromSlug };
