import { readFileSync } from 'fs';
import {
  createDefaultUniteLegale,
  IEtablissement,
  IEtablissementsList,
  IUniteLegale,
  SirenNotFoundError,
  splitByStatus,
} from '.';
import { HttpForbiddenError, HttpNotFound } from '../clients/exceptions';
import {
  getUniteLegaleInsee,
  getUniteLegaleInseeFallback,
} from '../clients/sirene-insee/siren';
import {
  getAllEtablissementsInsee,
  getAllEtablissementsInseeFallback,
  getSiegeInsee,
  getSiegeInseeFallback,
} from '../clients/sirene-insee/siret';
import getUniteLegaleSireneOuverte from '../clients/sirene-ouverte/siren';
import { Siren, verifySiren } from '../utils/helpers/siren-and-siret';
import {
  logFirstSireneInseefailed,
  logSecondSireneInseefailed,
  logSireneOuvertefailed,
} from '../utils/sentry/helpers';
import { getAssociation } from './association';
import { getEtatAdministratifUniteLegale } from './etat-administratif';
import { tvaIntracommunautaire } from './tva';

/**
 * List of siren whose owner refused diffusion
 */
const protectedSirenPath = 'public/protected-siren.txt';
const protectedSiren = readFileSync(protectedSirenPath, 'utf8').split('\n');
const isProtectedSiren = (siren: Siren) => protectedSiren.indexOf(siren) > -1;

/**
 * Return an uniteLegale given an existing siren
 */
export const getUniteLegaleFromSlug = async (
  slug: string,
  options: IUniteLegaleOptions
): Promise<IUniteLegale> => {
  const uniteLegale = new UniteLegale(slug);
  return await uniteLegale.get(options);
};

/**
 * PUBLIC METHODS
 */

interface IUniteLegaleOptions {
  page?: number;
  isBot?: boolean;
}

class UniteLegale {
  private _siren: Siren;

  constructor(slug: string) {
    this._siren = verifySiren(slug);
  }

  async get({ page = 1, isBot = false }: IUniteLegaleOptions) {
    let uniteLegale, tva;

    if (isBot) {
      uniteLegale = await getUniteLegaleForGoodBot(this._siren, page);
    } else {
      [uniteLegale, tva] = await Promise.all([
        getUniteLegale(this._siren, page),
        tvaIntracommunautaire(this._siren),
      ]);

      if (tva) {
        uniteLegale.numeroTva = tva;
      }

      if (uniteLegale.association && uniteLegale.association.id) {
        uniteLegale.association = {
          ...(await getAssociation(uniteLegale.association.id, uniteLegale)),
          id: uniteLegale.association.id,
        };
      }

      // only EI
      if (!uniteLegale.estDiffusible) {
        uniteLegale.nomComplet = 'Entité non-diffusible';
      }
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
    const uniteLegale = await getUniteLegaleSireneOuverte(siren, page);
    return uniteLegale;
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      // when not found in siren ouverte, fallback on insee
      try {
        return await fetchUniteLegaleFromInsee(siren, page);
      } catch (ee: any) {
        // in any Insee error
        throw new SirenNotFoundError(`Siren ${siren} was not found`);
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
      throw new SirenNotFoundError(`Siren ${siren} was not found`);
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
        getUniteLegaleInseeFallback(siren),
        getAllEtablissementsInseeFallback(siren, page).catch(() => null),
        getSiegeInseeFallback(siren).catch(() => null),
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
    allEtablissementsInsee?.etablissements || splitByStatus([siege]);
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
