import {
  HttpForbiddenError,
  HttpNotFound,
  HttpServerError,
} from '#clients/exceptions';
import { clientUniteLegaleRechercheEntreprise } from '#clients/recherche-entreprise/siren';
import { InseeClientOptions } from '#clients/sirene-insee';
import { clientUniteLegaleInsee } from '#clients/sirene-insee/siren';
import { createEtablissementsList } from '#models/core/etablissements-list';
import { IETATADMINSTRATIF, estActif } from '#models/core/etat-administratif';
import { Siren, verifySiren } from '#utils/helpers';
import { isProtectedSiren } from '#utils/helpers/is-protected-siren-or-siret';
import { logFatalErrorInSentry, logWarningInSentry } from '#utils/sentry';
import getSession from '#utils/server-side-helper/app/get-session';
import { shouldUseInsee } from '.';
import { EAdministration } from '../administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
  isAPI404,
  isAPINotResponding,
} from '../api-not-responding';
import { FetchRessourceException } from '../exceptions';
import { getTvaUniteLegale } from '../tva';
import {
  ISTATUTDIFFUSION,
  anonymiseUniteLegale,
  estDiffusible,
} from './diffusion';
import {
  IUniteLegale,
  SirenNotFoundError,
  createDefaultUniteLegale,
} from './types';

/**
 * PUBLIC METHODS
 */

interface IUniteLegaleOptions {
  page?: number;
  isBot: boolean;
}

/**
 * Return an uniteLegale if and only if siren is valid and exists otherwise throw SirenInvalid or SirenNotFound errors
 *
 */
export const getUniteLegaleFromSlug = async (
  slug: string,
  options: IUniteLegaleOptions
): Promise<IUniteLegale> => {
  const { isBot = false, page = 1 } = options;
  const builder = new UniteLegaleBuilder(slug, isBot, page);

  const uniteLegale = await builder.build();
  const session = await getSession();
  return anonymiseUniteLegale(uniteLegale, session);
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

    if (isProtectedSiren(uniteLegale.siren) && estDiffusible(uniteLegale)) {
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
      uniteLegale.etablissements.nombreEtablissementsOuverts === 0
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

    const useInsee = shouldUseInsee(
      uniteLegaleRechercheEntreprise,
      this._isBot,
      (ul: IUniteLegale) =>
        !estDiffusible(ul) || ul.complements.estEntrepreneurIndividuel,
      (ul: IUniteLegale) => {
        // checks for inconsistency in recherche response - needs a validation from sirene API
        // - no dateMiseAJourInsee CAN mean there are two siren for this UL
        // - no siege siret means CAN mean siege might be corrupted
        return !ul.dateMiseAJourInsee || !ul.siege.siret;
      }
    );

    if (!useInsee) {
      if (isAPI404(uniteLegaleRechercheEntreprise)) {
        throw new SirenNotFoundError(this._siren);
      }
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

    /**
     * Nowhere to be found
     */
    if (
      isAPI404(uniteLegaleRechercheEntreprise) &&
      isAPI404(uniteLegaleInsee)
    ) {
      throw new SirenNotFoundError(this._siren);
    }

    /**
     * Siren in RNE, not in Sirene
     */
    if (
      isAPI404(uniteLegaleInsee) &&
      !isAPINotResponding(uniteLegaleRechercheEntreprise)
    ) {
      return uniteLegaleRechercheEntreprise;
    }

    if (isAPINotResponding(uniteLegaleInsee)) {
      /***
       * Sirene Insee failed
       */
      if (isAPI404(uniteLegaleRechercheEntreprise)) {
        throw new SirenNotFoundError(this._siren);
      } else if (isAPINotResponding(uniteLegaleRechercheEntreprise)) {
        throw new HttpServerError('Both API failed');
      } else {
        return uniteLegaleRechercheEntreprise;
      }
    } else {
      /**
       * Sirene succeed but siren not in recherhce or recherche failed
       */
      if (
        isAPINotResponding(uniteLegaleRechercheEntreprise) ||
        isAPI404(uniteLegaleRechercheEntreprise)
      ) {
        logWarningInSentry(
          new FetchRessourceException({
            ressource: 'UniteLegaleRecherche',
            administration: EAdministration.DINUM,
            message: 'Fail to find siren in recherche API',
            context: {
              siren: this._siren,
            },
          })
        );
        return uniteLegaleInsee;
      }
    }

    /**
     * Default case, both API answered
     */
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
      listeIdcc: uniteLegaleRechercheEntreprise.listeIdcc,
      dateDerniereMiseAJour:
        uniteLegaleRechercheEntreprise.dateDerniereMiseAJour,
      dateMiseAJourInsee:
        uniteLegaleInsee.dateMiseAJourInsee ??
        uniteLegaleRechercheEntreprise.dateMiseAJourInsee,
      dateMiseAJourInpi: uniteLegaleRechercheEntreprise.dateMiseAJourInpi,
    };
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
  useCache: boolean,
  useFallback = false
): Promise<IUniteLegale | IAPINotRespondingError> => {
  try {
    const useFallback = false;
    return await clientUniteLegaleRechercheEntreprise(
      siren,
      pageEtablissements,
      useFallback,
      useCache
    );
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.DINUM, 404);
    }
    if (!useFallback) {
      const forceFallback = true;
      return await fetchUniteLegaleFromRechercheEntreprise(
        siren,
        pageEtablissements,
        forceFallback,
        useCache
      );
    }
    logFatalErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: 'UniteLegale',
        administration: EAdministration.DINUM,
        context: {
          siren,
        },
      })
    );

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
): Promise<IUniteLegale | IAPINotRespondingError> => {
  try {
    return await clientUniteLegaleInsee(siren, page, inseeOptions);
  } catch (e: any) {
    if (e instanceof HttpForbiddenError) {
      const uniteLegale = createDefaultUniteLegale(siren);
      uniteLegale.statutDiffusion = ISTATUTDIFFUSION.NON_DIFF_STRICT;
      uniteLegale.nomComplet = 'Entreprise non-diffusible';

      return uniteLegale;
    }
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.INSEE, 404);
    }

    if (!inseeOptions.useFallback) {
      return await fetchUniteLegaleFromInsee(siren, page, {
        ...inseeOptions,
        useFallback: true,
      });
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
