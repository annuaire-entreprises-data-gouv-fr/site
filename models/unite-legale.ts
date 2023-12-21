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
import { createEtablissementsList } from '#models/etablissements-list';
import { IETATADMINSTRATIF, estActif } from '#models/etat-administratif';
import {
  Siren,
  isEntrepreneurIndividuelFromNatureJuridique,
  verifySiren,
} from '#utils/helpers';
import { isProtectedSiren } from '#utils/helpers/is-protected-siren-or-siret';
import { logFatalErrorInSentry, logWarningInSentry } from '#utils/sentry';
import { IUniteLegale, SirenNotFoundError, createDefaultUniteLegale } from '.';
import { EAdministration } from './administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
  isAPINotResponding,
} from './api-not-responding';
import { FetchRessourceException } from './exceptions';
import { ISTATUTDIFFUSION } from './statut-diffusion';
import { getTvaUniteLegale } from './tva';

/**
 * PUBLIC METHODS
 */

interface IUniteLegaleOptions {
  page?: number;
  isBot: boolean;
}

/**
 * Return an uniteLegale if and only if siren is valid and exists otherwise throw SirenInvalid or SirenNotFound errors
 */
export const getUniteLegaleFromSlug = async (
  slug: string,
  options: IUniteLegaleOptions
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

    // determine TVA
    uniteLegale.tva = getTvaUniteLegale(uniteLegale);

    if (isProtectedSiren(uniteLegale.siren)) {
      uniteLegale.statutDiffusion = ISTATUTDIFFUSION.PROTECTED;
      uniteLegale.siege.statutDiffusion = ISTATUTDIFFUSION.PROTECTED;

      const allProtected = uniteLegale.etablissements.all.map((e) => {
        e.statutDiffusion = ISTATUTDIFFUSION.PROTECTED;
        return e;
      });
      uniteLegale.etablissements = createEtablissementsList(allProtected);
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

    const uniteLegaleRechercheEntreprise =
      await fetchUniteLegaleFromRechercheEntreprise(
        this._siren,
        this._page,
        useCache
      );

    const useInsee = this.shouldUseInsee(
      uniteLegaleRechercheEntreprise,
      this._isBot
    );

    if (!useInsee) {
      if (isAPINotResponding(uniteLegaleRechercheEntreprise)) {
        throw new HttpServerError('Recherche failed, return 500');
      }
      return uniteLegaleRechercheEntreprise;
    }

    const uniteLegaleInsee = await fetchUniteLegaleFromInsee(
      this._siren,
      this._page,
      {
        useFallback: false,
        useCache,
      }
    );

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
          conventionsCollectives:
            uniteLegaleRechercheEntreprise.conventionsCollectives,
        };
      }
    }
  };

  shouldUseInsee = (
    uniteLegaleRechercheEntreprise: IUniteLegale | IAPINotRespondingError,
    isBot: boolean
  ) => {
    const isInseeEnabled = process.env.INSEE_ENABLED !== 'disabled';
    if (!isInseeEnabled) {
      return false;
    }

    const rechercheEntrepriseFailed = isAPINotResponding(
      uniteLegaleRechercheEntreprise
    );

    if (rechercheEntrepriseFailed) {
      return true;
    } else {
      if (isBot) {
        return false;
      }

      const isEI = isEntrepreneurIndividuelFromNatureJuridique(
        uniteLegaleRechercheEntreprise.natureJuridique
      );

      if (isEI) {
        return true;
      }
    }
    return false;
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
  pageEtablissements: number,
  useCache: boolean
) => {
  try {
    const useFallback = false;
    return await clientUniteLegaleRechercheEntreprise(
      siren,
      pageEtablissements,
      useFallback,
      useCache
    );
  } catch (e: any) {
    if (!(e instanceof HttpNotFound)) {
      try {
        const forceFallback = true;
        return await clientUniteLegaleRechercheEntreprise(
          siren,
          pageEtablissements,
          forceFallback,
          useCache
        );
      } catch (eFallback: any) {
        if (!(eFallback instanceof HttpNotFound)) {
          logFatalErrorInSentry(
            new FetchRessourceException({
              cause: eFallback,
              ressource: 'UniteLegale',
              administration: EAdministration.DINUM,
              context: {
                siren,
              },
            })
          );
        }
      }
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
        // better empty etablissement than failing UL
        clientAllEtablissementsInsee(siren, page, inseeOptions).catch(
          (e) => null
        ),
        // better empty etablissement than failing UL especially for
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

    logWarningInSentry(
      new FetchRessourceException({
        ressource: 'UniteLegaleInsee',
        administration: EAdministration.INSEE,
        message: `Fail to fetch from INSEE ${
          inseeOptions.useFallback ? 'fallback' : ''
        } API`,
        cause: e,
        context: {
          siren,
        },
      })
    );

    return APINotRespondingFactory(EAdministration.INSEE, 500);
  }
};
