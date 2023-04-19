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
  logSecondSireneInseefailed,
} from '#utils/sentry/helpers';
import {
  createDefaultUniteLegale,
  IEtablissement,
  IUniteLegale,
  SirenNotFoundError,
} from '.';
import { isAssociation } from '.';
import { EAdministration } from './administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
  isAPINotResponding,
} from './api-not-responding';
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

  const uniteLegale = new UniteLegaleBuilder(slug, isBot, page);

  return await uniteLegale.build();
};

class UniteLegaleBuilder {
  private _siren: Siren;
  private _isBot: boolean;
  private _page: number;

  constructor(slug: string, isBot = false, page = 1) {
    this._siren = verifySiren(slug);
    this._isBot = isBot;
    this._page = page;
  }

  build = async () => {
    const getUniteLegaleInsee = this._isBot
      ? async () => await fetchUniteLegaleFromInsee(this._siren, this._page)
      : () => APINotRespondingFactory(EAdministration.INSEE, 422);

    // dont use cache for bot
    const useCache = !this._isBot;

    const [uniteLegaleInsee, uniteLegaleRechercheEntreprise] =
      await Promise.all([
        getUniteLegaleInsee(),
        fetchUniteLegaleFromRechercheEntreprise(this._siren, useCache),
      ]);

    const uniteLegale = await this.mergeInseeAndRechercheEntreprise(
      uniteLegaleInsee,
      uniteLegaleRechercheEntreprise
    );

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

  mergeInseeAndRechercheEntreprise = async (
    uniteLegaleInsee: IUniteLegale | IAPINotRespondingError,
    uniteLegaleRechercheEntreprise: IUniteLegale | IAPINotRespondingError
  ): Promise<IUniteLegale> => {
    if (isAPINotResponding(uniteLegaleInsee)) {
      if (isAPINotResponding(uniteLegaleRechercheEntreprise)) {
        return await fetchUniteLegaleFromInseeFallback(this._siren, this._page);
      } else {
        return uniteLegaleRechercheEntreprise;
      }
    } else {
      if (isAPINotResponding(uniteLegaleRechercheEntreprise)) {
        return uniteLegaleInsee;
      } else {
        return {
          ...uniteLegaleInsee,
          ...uniteLegaleRechercheEntreprise,
          complements: {
            ...uniteLegaleInsee?.complements,
            ...uniteLegaleRechercheEntreprise.complements,
          },
          colter: {
            ...uniteLegaleInsee?.colter,
            ...uniteLegaleRechercheEntreprise.colter,
          },
          chemin: uniteLegaleRechercheEntreprise.chemin,
        };
      }
    }
  };
}

//=========================
//        API calls
//=========================

/**
 * Fetch Unite Legale from Sirene Recherche Entreprise
 */
const fetchUniteLegaleFromRechercheEntreprise = async (
  siren: Siren,
  useCache: boolean
) => {
  try {
    const useFallback = false;
    return await clientUniteLegaleRechercheEntreprise(
      siren,
      useFallback,
      useCache
    );
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.DINUM, 404);
    }

    logRechercheEntreprisefailed({ siren, details: e.message || e });
    return APINotRespondingFactory(EAdministration.INSEE, 500);
  }
};

/**
 * Fetch Unite Legale from Sirene INSEE
 */
const fetchUniteLegaleFromInsee = async (siren: Siren, page = 1) => {
  try {
    // INSEE requires three calls to get uniteLegale with etablissementsand siege
    const [uniteLegaleInsee, allEtablissementsInsee, siegeInsee] =
      await Promise.all([
        clientUniteLegaleInsee(siren),
        clientAllEtablissementsInsee(siren, page).catch(() => null),
        clientSiegeInsee(siren).catch(() => null),
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
    if (e instanceof HttpNotFound) {
      throw new SirenNotFoundError(siren);
    }

    logFirstSireneInseefailed({ siren, details: e.message || e });
    return APINotRespondingFactory(EAdministration.INSEE, 500);
  }
};

/**
 * Fetch Unite Legale from Sirene INSEE only, using fallback credentials
 */
const fetchUniteLegaleFromInseeFallback = async (siren: Siren, page = 1) => {
  try {
    // INSEE requires three calls to get uniteLegale with etablissementsand siege
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

    logSecondSireneInseefailed({ siren, details: e.message || e });
    throw new SirenNotFoundError(siren);
  }
};

/**
 * Merge all three responses form INSEE
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
