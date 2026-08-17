import { HttpNotFound, HttpServerError } from "#/clients/exceptions";
import { clientFondationRechercheEntreprise } from "#/clients/recherche-entreprise/rnf";
import { clientSIAFFondation } from "#/clients/siaf/index.server";
import type { IFondationResult } from "#/clients/siaf/interface";
import { verifyIdRnf } from "#/utils/helpers/fondations";
import { logFatalErrorInSentry, logWarningInSentry } from "#/utils/sentry";
import { EAdministration } from "../administrations/e-administration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
  isAPI404,
  isAPINotResponding,
} from "../api-not-responding";
import { FetchRessourceException } from "../exceptions";
import { IdRnfNotFoundError, type IFondation } from "./fondations.types";

/**
 * PUBLIC METHODS
 */

interface IFondationOptions {
  isBot: boolean;
  page?: number;
}

/**
 * Return an uniteLegale if and only if siren is valid and exists otherwise throw SirenInvalid or SirenNotFound errors
 *
 */
export const getFondationFromSlug = async (
  slug: string,
  options: IFondationOptions
): Promise<IFondation> => {
  const { page = 1 } = options;
  const builder = new FondationBuilder(slug, page);

  const fondation = await builder.build();

  return fondation;
};

class FondationBuilder {
  private readonly _idRnf: string;
  private readonly _page: number;

  constructor(slug: string, page = 1) {
    this._idRnf = verifyIdRnf(slug);
    this._page = page;
  }

  build = async () => {
    const fondation = await this.fetchFromClients();

    // If we need to add some business logic to the fondation object (non diffusible for example), we can do it here

    return fondation;
  };

  fetchFromClients = async (): Promise<IFondation> => {
    const shouldRetry = true;
    const fondationRechercheEntreprise =
      await fetchFondationFromRechercheEntreprise(
        this._idRnf,
        this._page,
        shouldRetry
      );

    const fondationSiaf = await fetchFondationFromSiaf(this._idRnf, false);

    if (isAPI404(fondationRechercheEntreprise) && isAPI404(fondationSiaf)) {
      throw new IdRnfNotFoundError(this._idRnf);
    }

    if (
      isAPINotResponding(fondationRechercheEntreprise) &&
      isAPINotResponding(fondationSiaf)
    ) {
      throw new HttpServerError("Both API failed");
    }

    if (isAPINotResponding(fondationSiaf)) {
      /**
       * Fondation in RNF Recherche Entreprise, not in SIAF
       */
      return fondationRechercheEntreprise as IFondation;
    }

    const fondationSiafResult: IFondation = {
      address: fondationSiaf.address.oneLine,
      creationDate: fondationSiaf.creationAt,
      department: fondationSiaf.department,
      foundationType: fondationSiaf.foundationType,
      generalInterestDomain: fondationSiaf.generalInterestDomain,
      hasInternationalActivity: fondationSiaf.hasInternationalActivity,
      id: fondationSiaf.id,
      postalCode: fondationSiaf.address.dsAddress.postalCode,
      siret: fondationSiaf.siret,
      socialObject: fondationSiaf.socialObject,
      state: fondationSiaf.state,
      stateEffectiveAt: fondationSiaf.stateEffectiveAt,
      title: fondationSiaf.title,
    };

    if (isAPINotResponding(fondationRechercheEntreprise)) {
      /**
       * Fondation in SIAF, not in RNF Recherche Entreprise
       */
      logWarningInSentry(
        new FetchRessourceException({
          ressource: "FondationRechercheEntreprise",
          administration: EAdministration.DINUM,
          message: "Fail to find id RNF in recherche API",
          context: {
            idRnf: this._idRnf,
          },
        })
      );

      return fondationSiafResult;
    }

    /**
     * Default case, both API answered
     */
    return {
      ...fondationRechercheEntreprise,
      ...fondationSiafResult,
    };
  };
}

//=========================
//        API calls
//=========================

/**
 * Fetch Fondation from RNF Recherche Entreprise
 */

export const fetchFondationFromRechercheEntreprise = async (
  idRnf: string,
  pageEtablissements: number,
  shouldRetry: boolean
): Promise<IFondation | IAPINotRespondingError> => {
  try {
    return await clientFondationRechercheEntreprise(idRnf, pageEtablissements);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.DINUM, 404);
    }
    if (shouldRetry) {
      const shouldRetryAgain = false;
      return await fetchFondationFromRechercheEntreprise(
        idRnf,
        pageEtablissements,
        shouldRetryAgain
      );
    }
    logFatalErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: "Fondation",
        administration: EAdministration.DINUM,
        context: {
          idRnf,
        },
      })
    );

    return APINotRespondingFactory(EAdministration.DINUM, 500);
  }
};

/**
 * Fetch Fondation from SIAF
 */
const fetchFondationFromSiaf = async (
  idRnf: string,
  useFallback: boolean
): Promise<IFondationResult | IAPINotRespondingError> => {
  try {
    return await clientSIAFFondation(idRnf);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.SIAF, 404);
    }

    if (!useFallback) {
      return await fetchFondationFromSiaf(idRnf, true);
    }

    logWarningInSentry(
      new FetchRessourceException({
        ressource: "Fondation",
        administration: EAdministration.SIAF,
        message: `Fail to fetch from SIAF ${useFallback ? "fallback" : ""} API`,
        cause: e,
        context: {
          idRnf,
        },
      })
    );

    return APINotRespondingFactory(EAdministration.SIAF, 500);
  }
};
