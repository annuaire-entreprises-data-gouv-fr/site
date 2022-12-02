import { readFileSync } from 'fs';
import {
  createDefaultUniteLegale,
  IEtablissement,
  IUniteLegale,
  SirenNotFoundError,
} from '.';
import { HttpForbiddenError, HttpNotFound } from '../clients/exceptions';
import {
  clientUniteLegaleInsee,
  clientUniteLegaleInseeFallback,
} from '../clients/sirene-insee/siren';
import {
  clientAllEtablissementsInsee,
  clientAllEtablissementsInseeFallback,
  clientSiegeInsee,
  clientSiegeInseeFallback,
} from '../clients/sirene-insee/siret';
import clientUniteLegaleSireneOuverte from '../clients/sirene-ouverte/siren';
import { Siren, verifySiren } from '../utils/helpers/siren-and-siret';
import {
  logFirstSireneInseefailed,
  logSecondSireneInseefailed,
  logSireneOuvertefailed,
} from '../utils/sentry/helpers';
import { isAssociation } from '.';
import {
  createEtablissementsList,
  IEtablissementsList,
} from './etablissements-list';
import { getEtatAdministratifUniteLegale } from './etat-administratif';
import { getAssociation } from './association';
import clientComplementsSireneOuverte from '../clients/recherche-entreprise/siren';

/**
 * List of siren whose owner refused diffusion
 */
const protectedSirenPath = 'public/protected-siren.txt';
const protectedSiren = readFileSync(protectedSirenPath, 'utf8').split('\n');
const isProtectedSiren = (siren: Siren) => protectedSiren.indexOf(siren) > -1;

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
  return await uniteLegale.get();
};

class UniteLegaleFactory {
  private _siren: Siren;
  private _isBot: boolean;
  private _page: number;
  private _getUniteLegaleCore: (
    siren: Siren,
    page: number
  ) => Promise<IUniteLegale>;

  constructor(slug: string, isBot = false, page = 1) {
    this._siren = verifySiren(slug);
    this._isBot = isBot;
    this._page = page;

    this._getUniteLegaleCore = isBot
      ? getUniteLegaleForGoodBot
      : getUniteLegale;
  }

  async get() {
    let [uniteLegale, { complements, colter }] = await Promise.all([
      this._getUniteLegaleCore(this._siren, this._page),
      // colter, labels and certificates, from sirene ouverte
      clientComplementsSireneOuverte(this._siren).catch(() => {
        return { complements: null, colter: { codeColter: null } };
      }),
    ]);

    uniteLegale.complements = { ...uniteLegale.complements, ...complements };
    uniteLegale.colter = { ...uniteLegale.colter, ...colter };

    // no need to call API association for bot
    if (!this._isBot && isAssociation(uniteLegale)) {
      uniteLegale = await getAssociation(uniteLegale);
    }

    if (
      uniteLegale.complements.estEntrepreneurIndividuel &&
      !uniteLegale.estDiffusible
    ) {
      uniteLegale.nomComplet = 'Entité non-diffusible';
    }

    // only entreprise commerciales
    if (isProtectedSiren(uniteLegale.siren)) {
      uniteLegale.estEntrepriseCommercialeDiffusible = false;
    }

    uniteLegale.etatAdministratif =
      getEtatAdministratifUniteLegale(uniteLegale);

    return uniteLegale;
  }
}

/** =========
 *  Fetching
 * ==========
 * /

/**
 * For Indexing bot only - Fetch an uniteLegale from SireneOuverte
 *
 */
const getUniteLegaleForGoodBot = async (
  siren: Siren,
  page = 1
): Promise<IUniteLegale> => {
  try {
    const uniteLegale = await clientUniteLegaleSireneOuverte(siren, page);
    return uniteLegale;
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
      return await clientUniteLegaleSireneOuverte(siren, page);
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

  const chemin = `${uniteLegaleInsee.nomComplet}-${uniteLegaleInsee.siren}`
    .toLowerCase()
    .replaceAll(/[^a-zA-Z0-9]+/g, '-');

  const etablissements =
    allEtablissementsInsee?.etablissements || createEtablissementsList([siege]);
  const { currentEtablissementPage, nombreEtablissements } = etablissements;

  return {
    ...uniteLegaleInsee,
    siege,
    chemin,
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
  uniteLegale.estDiffusible = false;
  uniteLegale.nomComplet =
    'Les informations de cette entité ne sont pas publiques';

  return uniteLegale;
};
