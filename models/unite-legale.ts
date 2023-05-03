import {
  HttpForbiddenError,
  HttpNotFound,
  HttpServerError,
} from '#clients/exceptions';
import { clientUniteLegaleRechercheEntreprise } from '#clients/recherche-entreprise/siren';
import { InseeClientOptions } from '#clients/sirene-insee';
import { clientUniteLegaleInsee } from '#clients/sirene-insee/siren';
import {
  clientAllEtablissementsInsee,
  clientSiegeInsee,
} from '#clients/sirene-insee/siret';
import { getAssociation } from '#models/association';
import { createEtablissementsList } from '#models/etablissements-list';
import { estActif, IETATADMINSTRATIF } from '#models/etat-administratif';
import { Siren, verifySiren } from '#utils/helpers';
import { isProtectedSiren } from '#utils/helpers/is-protected-siren-or-siret';
import {
  logRechercheEntreprisefailed,
  logSireneInseefailed,
} from '#utils/sentry/helpers';
import { createDefaultUniteLegale, IUniteLegale, SirenNotFoundError } from '.';
import { isAssociation } from '.';
import { EAdministration } from './administrations';
import {
  APINotRespondingFactory,
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
 * Return an uniteLegale if and only if siren is valid and exists otherwise throw SirenInvalid or SirenNotFound errors
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
    const uniteLegale = await this.fetchFromClients();

    // no need to call API association for bots
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

  fetchFromClients = async (): Promise<IUniteLegale> => {
    // no cache for bot as they scrap so they tend not to call the same siren twice
    const useCache = !this._isBot;

    const getUniteLegaleInsee = this._isBot
      ? () => APINotRespondingFactory(EAdministration.INSEE, 403) // never call Insee for bot
      : async () =>
          await fetchUniteLegaleFromInsee(this._siren, this._page, {
            useFallback: false,
            useCache,
          });

    const [uniteLegaleInsee, uniteLegaleRechercheEntreprise] =
      await Promise.all([
        getUniteLegaleInsee(),
        fetchUniteLegaleFromRechercheEntreprise(this._siren, useCache),
      ]);

    if (isAPINotResponding(uniteLegaleInsee)) {
      if (isAPINotResponding(uniteLegaleRechercheEntreprise)) {
        const uniteLegaleInseeFallbacked = await fetchUniteLegaleFromInsee(
          this._siren,
          this._page,
          {
            useFallback: true,
            useCache,
          }
        );
        if (isAPINotResponding(uniteLegaleInseeFallbacked)) {
          throw new HttpServerError('Sirene Insee fallback failed, return 500');
        }
        return uniteLegaleInseeFallbacked;
      } else {
        return uniteLegaleRechercheEntreprise;
      }
    } else {
      if (isAPINotResponding(uniteLegaleRechercheEntreprise)) {
        return uniteLegaleInsee;
      } else {
        return {
          ...uniteLegaleInsee,
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
    if (!(e instanceof HttpNotFound)) {
      logRechercheEntreprisefailed({ siren, details: e.message || e });
    }
    // we dont care about the type of exception here as HttpNotFound and HttpServerError will both be useless to us
    return APINotRespondingFactory(EAdministration.DINUM, 500);
  }
};

/**
 * Fetch Unite Legale from Sirene INSEE
 */
const fetchUniteLegaleFromInsee = async (
  siren: Siren,
  page = 1,
  inseeOptions: InseeClientOptions
) => {
  try {
    // INSEE requires three calls to get uniteLegale with etablissements and siege
    const [uniteLegaleInsee, allEtablissementsInsee, siegeInsee] =
      await Promise.all([
        clientUniteLegaleInsee(siren, inseeOptions),
        clientAllEtablissementsInsee(siren, page, inseeOptions).catch(
          () => null
        ),
        clientSiegeInsee(siren, inseeOptions).catch(() => null),
      ]);

    const siege = siegeInsee || uniteLegaleInsee.siege;

    const etablissements =
      allEtablissementsInsee?.etablissements ||
      createEtablissementsList([siege]);

    const { currentEtablissementPage = 0, nombreEtablissements = 1 } =
      etablissements;

    return {
      ...uniteLegaleInsee,
      siege,
      etablissements,
      currentEtablissementPage,
      nombreEtablissements,
    };
  } catch (e: any) {
    if (e instanceof HttpForbiddenError) {
      const uniteLegale = createDefaultUniteLegale(siren);
      uniteLegale.statutDiffusion = ISTATUTDIFFUSION.NONDIFF;
      uniteLegale.nomComplet = 'Entreprise non-diffusible';

      return uniteLegale;
    }
    if (e instanceof HttpNotFound) {
      throw new SirenNotFoundError(siren);
    }

    logSireneInseefailed(
      { siren, details: e.message || e },
      inseeOptions.useFallback
    );

    return APINotRespondingFactory(EAdministration.INSEE, 500);
  }
};
