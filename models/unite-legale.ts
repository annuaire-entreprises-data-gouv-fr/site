import { HttpForbiddenError, HttpNotFound } from '#clients/exceptions';
import { clientUniteLegaleRechercheEntreprise } from '#clients/recherche-entreprise/siren';
import {
  clientUniteLegaleInsee,
  clientUniteLegaleInseeFallback,
} from '#clients/sirene-insee/siren';
import {
  clientAllEtablissementsInsee,
  clientAllEtablissementsInseeFallback,
  clientSiegeInsee,
  clientSiegeInseeFallback,
} from '#clients/sirene-insee/siret';
import { getAssociation } from '#models/association';
import {
  createEtablissementsList,
  IEtablissementsList,
} from '#models/etablissements-list';
import { estActif, IETATADMINSTRATIF } from '#models/etat-administratif';
import { Siren, verifySiren } from '#utils/helpers';
import { isProtectedSiren } from '#utils/helpers/is-protected-siren-or-siret';
import {
  logFirstSireneInseefailed,
  logRechercheEntreprisefailed,
  logRechercheEntrepriseForGoodBotfailed,
  logSecondSireneInseefailed,
} from '#utils/sentry/helpers';
import {
  createDefaultUniteLegale,
  IEtablissement,
  IUniteLegale,
  SirenNotFoundError,
} from '.';
import { isAssociation } from '.';
import { ISTATUTDIFFUSION } from './statut-diffusion';

/**
 * PUBLIC METHODS
 */

interface IUniteLegaleOptions {
  page?: number;
  isBot?: boolean;
}

/**
 * Return an uniteLegale given an existing siren
 */
export const getUniteLegaleFromSlug = async (
  slug: string,
  options: IUniteLegaleOptions = {}
): Promise<IUniteLegale> => {
  const { isBot = false, page = 1 } = options;

  const uniteLegale = new UniteLegaleFactory(slug, isBot, page);

  return await uniteLegale.build();
};

class UniteLegaleFactory {
  private _siren: Siren;
  private _isBot: boolean;
  private _page: number;

  constructor(slug: string, isBot = false, page = 1) {
    this._siren = verifySiren(slug);
    this._isBot = isBot;
    this._page = page;
  }

  build = async () => {
    const uniteLegaleRaw = await this.get();
    const uniteLegale = this.postProcess(uniteLegaleRaw);
    return uniteLegale;
  };

  get = async () => {
    if (this._isBot) {
      return await this.getForBot();
    } else {
      return await this.getForUser();
    }
  };

  getForUser = async () => {
    const page = 1;
    const useCache = true;
    const [uniteLegale, { colter = {}, complements = {}, chemin }] =
      await Promise.all([
        getUniteLegale(this._siren, this._page),
        // colter, labels and certificates, from sirene ouverte
        getUniteLegaleForGoodBot(this._siren, page, useCache).catch(() => {
          return { colter: {}, complements: {}, chemin: this._siren };
        }),
      ]);

    uniteLegale.complements = {
      ...uniteLegale.complements,
      ...complements,
    };
    uniteLegale.colter = { ...uniteLegale.colter, ...colter };
    uniteLegale.chemin = chemin;
    return uniteLegale;
  };

  getForBot = async () => {
    const useCache = false;
    return await getUniteLegaleForGoodBot(this._siren, this._page, useCache);
  };

  postProcess = async (uniteLegale: IUniteLegale) => {
    // no need to call API association for bot
    if (!this._isBot && isAssociation(uniteLegale)) {
      uniteLegale.association.data = await getAssociation(uniteLegale);
    }

    if (isProtectedSiren(uniteLegale.siren)) {
      uniteLegale.statutDiffusion = ISTATUTDIFFUSION.PARTIAL;
    }

    // en sommeil
    if (
      estActif(uniteLegale) &&
      !(uniteLegale.etablissements.all || []).find((a) => estActif(a))
    ) {
      uniteLegale.etatAdministratif =
        IETATADMINSTRATIF.ACTIF_ZERO_ETABLISSEMENT;
    }

    return uniteLegale;
  };
}

/**
 * For Indexing bot only - Fetch an uniteLegale from clientUniteLegaleRechercheEntreprise
 *
 */
const getUniteLegaleForGoodBot = async (
  siren: Siren,
  page = 1,
  useCache = false
): Promise<IUniteLegale> => {
  let fallbackOnStaging = false;
  try {
    return await clientUniteLegaleRechercheEntreprise(
      siren,
      fallbackOnStaging,
      useCache
    );
  } catch (e: any) {
    try {
      if (e instanceof HttpNotFound) {
        // when not found in siren ouverte, fallback on insee
        return await fetchUniteLegaleFromInsee(siren, page);
      } else {
        fallbackOnStaging = true;
        return await clientUniteLegaleRechercheEntreprise(
          siren,
          fallbackOnStaging,
          useCache
        );
      }
    } catch (eFallback: any) {
      if (!(eFallback instanceof HttpNotFound)) {
        logRechercheEntrepriseForGoodBotfailed({
          siren,
          details: eFallback.message || eFallback,
        });
      }
      throw new SirenNotFoundError(siren);
    }
  }
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
      return await clientUniteLegaleRechercheEntreprise(siren);
    } catch (firstFallback: any) {
      logRechercheEntreprisefailed({
        siren,
        details: firstFallback.message || firstFallback,
      });

      try {
        // in case sirene etalab 404 or 500, fallback on Sirene insee using fallback credentials to avoid 403
        // no pagination as this function is called when sirene etalab already failed
        return await fetchUniteLegaleFromInseeFallback(siren, page);
      } catch (lastFallback: any) {
        logSecondSireneInseefailed({
          siren,
          details: lastFallback.message || lastFallback,
        });

        // Siren was not found in both API, return a 404
        throw new SirenNotFoundError(siren);
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
const fetchUniteLegaleFromInsee = async (siren: Siren, page = 1) => {
  try {
    // INSEE does not provide enough information to paginate etablissement list
    // so we doubled our API call with sirene ouverte to get Etablissements.
    const [uniteLegaleInsee, allEtablissementsInsee, siegeInsee] =
      await Promise.all([
        clientUniteLegaleInsee(siren),
        clientAllEtablissementsInsee(siren, page).catch(() => null),
        clientSiegeInsee(siren),
      ]);

    return mergeUniteLegaleInsee(
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
        clientUniteLegaleInseeFallback(siren),
        clientAllEtablissementsInseeFallback(siren, page).catch(() => null),
        clientSiegeInseeFallback(siren).catch(() => null),
      ]);

    return mergeUniteLegaleInsee(
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
const mergeUniteLegaleInsee = (
  uniteLegaleInsee: IUniteLegale,
  allEtablissementsInsee: IEtablissementsList | null,
  siegeInsee: IEtablissement | null
) => {
  const siege = siegeInsee || uniteLegaleInsee.siege;

  const etablissements =
    allEtablissementsInsee?.etablissements || createEtablissementsList([siege]);
  const { currentEtablissementPage, nombreEtablissements } = etablissements;

  return {
    ...uniteLegaleInsee,
    siege,
    etablissements,
    currentEtablissementPage: currentEtablissementPage || 0,
    nombreEtablissements: nombreEtablissements || 1,
  };
};

/**
 * Create a default UniteLegale that will display as non diffusible
 */
const createNonDiffusibleUniteLegale = (siren: Siren) => {
  const uniteLegale = createDefaultUniteLegale(siren);
  uniteLegale.statutDiffusion = ISTATUTDIFFUSION.NONDIFF;
  uniteLegale.nomComplet = 'Entreprise non-diffusible';

  return uniteLegale;
};
